import { create } from 'zustand';
import { 
  StoreItem, 
  StoreOrder, 
  OrderStatus, 
  StoreDrop,
  getItemsByUserType,
  getItemsByCategory,
  getItemsByType,
  getActiveDrops,
  getDropById,
  getItemById,
  searchItems,
  StoreCategory,
  StoreItemType
} from '../types/store';
import { UserType } from '../types';
import { useAuthStore } from './authStore';

interface StoreState {
  items: StoreItem[];
  filteredItems: StoreItem[];
  userOrders: StoreOrder[];
  activeDrops: StoreDrop[];
  selectedItem: StoreItem | null;
  selectedDrop: StoreDrop | null;
  cart: { itemId: string; quantity: number }[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    userType: UserType | 'all';
    search: string;
    sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  };
  fetchItems: () => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;
  fetchActiveDrops: () => Promise<void>;
  fetchDropById: (dropId: string) => Promise<void>;
  fetchItemById: (itemId: string) => Promise<void>;
  updateFilters: (newFilters: Partial<StoreState['filters']>) => void;
  addToCart: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  purchaseItems: () => Promise<void>;
  redeemItem: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getItemStock: (itemId: string) => number;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  searchStoreItems: (query: string) => Promise<void>;
  applyFilters: () => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  items: [],
  filteredItems: [],
  userOrders: [],
  activeDrops: [],
  selectedItem: null,
  selectedDrop: null,
  cart: [],
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    type: 'all',
    minPrice: 0,
    maxPrice: 1000,
    userType: 'all',
    search: '',
    sortBy: 'newest'
  },

  fetchItems: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Get items for user type
      const userItems = getItemsByUserType(user.userType as UserType);
      
      set({ 
        items: userItems,
        filteredItems: userItems,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch store items',
        isLoading: false 
      });
    }
  },

  fetchUserOrders: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // For real user testing, start with empty orders
      const userOrders: StoreOrder[] = [];
      
      set({ 
        userOrders,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user orders',
        isLoading: false 
      });
    }
  },

  fetchActiveDrops: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get active drops
      const drops = getActiveDrops();
      
      set({ 
        activeDrops: drops,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch active drops',
        isLoading: false 
      });
    }
  },

  fetchDropById: async (dropId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get drop by ID
      const drop = getDropById(dropId);
      
      if (!drop) {
        throw new Error('Drop not found');
      }
      
      set({ 
        selectedDrop: drop,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch drop',
        isLoading: false 
      });
    }
  },

  fetchItemById: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get item by ID
      const item = getItemById(itemId);
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      set({ 
        selectedItem: item,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch item',
        isLoading: false 
      });
    }
  },

  updateFilters: (newFilters: Partial<StoreState['filters']>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
    
    // Apply filters
    get().applyFilters();
  },

  addToCart: (itemId: string, quantity: number) => {
    const { cart } = get();
    
    // Check if item is already in cart
    const existingItem = cart.find(item => item.itemId === itemId);
    
    if (existingItem) {
      // Update quantity
      set(state => ({
        cart: state.cart.map(item => 
          item.itemId === itemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }));
    } else {
      // Add new item
      set(state => ({
        cart: [...state.cart, { itemId, quantity }]
      }));
    }
  },

  removeFromCart: (itemId: string) => {
    set(state => ({
      cart: state.cart.filter(item => item.itemId !== itemId)
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  purchaseItems: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Get cart
      const { cart } = get();
      
      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Calculate total price
      const total = get().getCartTotal();
      
      // Check if user has enough beatcoins
      if (user.beatcoins < total) {
        throw new Error('Not enough Beatcoins');
      }
      
      // Create orders
      const orders: StoreOrder[] = cart.map(cartItem => {
        const item = getItemById(cartItem.itemId);
        
        if (!item) {
          throw new Error(`Item ${cartItem.itemId} not found`);
        }
        
        return {
          id: `order_${Date.now()}_${cartItem.itemId}`,
          userId: user.id,
          itemId: cartItem.itemId,
          quantity: cartItem.quantity,
          totalPrice: item.price * cartItem.quantity,
          status: OrderStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
      
      // Update user's beatcoins
      const { updateProfile } = useAuthStore.getState();
      if (updateProfile) {
        updateProfile({
          beatcoins: user.beatcoins - total
        });
      }
      
      // Update orders
      set(state => ({
        userOrders: [...state.userOrders, ...orders],
        cart: [],
        isLoading: false
      }));
      
      return orders;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to purchase items',
        isLoading: false 
      });
      throw error;
    }
  },

  redeemItem: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get order
      const { userOrders } = get();
      const orderIndex = userOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      // Generate redemption code
      const redemptionCode = `COSMIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Update order
      const updatedOrders = [...userOrders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        status: OrderStatus.REDEEMED,
        redemptionCode,
        redemptionDate: new Date(),
        updatedAt: new Date()
      };
      
      set({ 
        userOrders: updatedOrders,
        isLoading: false 
      });
      
      return redemptionCode;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to redeem item',
        isLoading: false 
      });
      throw error;
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get order
      const { userOrders } = get();
      const orderIndex = userOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      const order = userOrders[orderIndex];
      
      // Check if order can be cancelled
      if (order.status !== OrderStatus.PENDING) {
        throw new Error('Order cannot be cancelled');
      }
      
      // Update order
      const updatedOrders = [...userOrders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
      };
      
      // Refund beatcoins
      const { user, updateProfile } = useAuthStore.getState();
      if (user && updateProfile) {
        updateProfile({
          beatcoins: user.beatcoins + order.totalPrice
        });
      }
      
      set({ 
        userOrders: updatedOrders,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel order',
        isLoading: false 
      });
      throw error;
    }
  },

  getItemStock: (itemId: string) => {
    const item = getItemById(itemId);
    
    if (!item) {
      return 0;
    }
    
    return item.stock || Infinity;
  },

  getCartTotal: () => {
    const { cart } = get();
    
    return cart.reduce((total, cartItem) => {
      const item = getItemById(cartItem.itemId);
      
      if (!item) {
        return total;
      }
      
      return total + (item.price * cartItem.quantity);
    }, 0);
  },

  getCartItemCount: () => {
    const { cart } = get();
    
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  },

  searchStoreItems: async (query: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Search items
      const results = searchItems(query);
      
      set({ 
        filteredItems: results,
        filters: { ...get().filters, search: query },
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search items',
        isLoading: false 
      });
    }
  },

  applyFilters: () => {
    const { items, filters } = get();
    
    let filtered = [...items];
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }
    
    // Filter by price
    filtered = filtered.filter(item => 
      item.price >= filters.minPrice && item.price <= filters.maxPrice
    );
    
    // Filter by user type
    if (filters.userType !== 'all') {
      filtered = filtered.filter(item => 
        item.userType === filters.userType || item.userType === 'all'
      );
    }
    
    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort items
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // For demo purposes, we'll just keep the original order
        break;
    }
    
    set({ filteredItems: filtered });
  }
}));