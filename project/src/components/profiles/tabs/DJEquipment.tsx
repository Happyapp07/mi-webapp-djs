import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, X, Edit3, Save, ExternalLink } from 'lucide-react';
import { DJProfile, EquipmentBrand, SoftwareBrand } from '../../../types/profiles';
import { getBrandAffiliateLink } from '../../../utils/affiliateLinks';
import FieldCompletionIndicator from '../../common/FieldCompletionIndicator';
import { isProfileFieldComplete } from '../../../utils/profileCompletion';

interface DJEquipmentProps {
  profile: DJProfile;
  isOwnProfile?: boolean;
  onUpdate?: (data: Partial<DJProfile>) => void;
}

// Mock brand data - in a real app this would come from a database
const EQUIPMENT_BRANDS: EquipmentBrand[] = [
  { id: 'pioneer-cdj', name: 'Pioneer CDJ-3000', logo: 'https://logos-world.net/wp-content/uploads/2023/03/Pioneer-DJ-Logo.png', category: 'turntables', website: 'https://www.pioneerdj.com/en-us/product/player/cdj-3000/black/overview/' },
  { id: 'pioneer-djm', name: 'Pioneer DJM-900NXS2', logo: 'https://logos-world.net/wp-content/uploads/2023/03/Pioneer-DJ-Logo.png', category: 'mixer', website: 'https://www.pioneerdj.com/en-us/product/mixer/djm-900nxs2/black/overview/' },
  { id: 'technics-1200', name: 'Technics SL-1200', logo: 'https://logos-world.net/wp-content/uploads/2023/03/Technics-Logo.png', category: 'turntables', website: 'https://www.technics.com/us/products/dj-equipment/sl-1200-series.html' },
  { id: 'denon-prime', name: 'Denon Prime 4', logo: 'https://logos-world.net/wp-content/uploads/2023/02/Denon-DJ-Logo.png', category: 'controller', website: 'https://www.denondj.com/prime-4' }
];

const SOFTWARE_BRANDS: SoftwareBrand[] = [
  { id: 'serato', name: 'Serato DJ Pro', logo: 'https://logos-world.net/wp-content/uploads/2023/02/Serato-Logo.png', type: 'dj_software', website: 'https://serato.com/dj' },
  { id: 'rekordbox', name: 'Rekordbox', logo: 'https://logos-world.net/wp-content/uploads/2023/03/Rekordbox-Logo.png', type: 'dj_software', website: 'https://rekordbox.com/' },
  { id: 'traktor', name: 'Traktor Pro', logo: 'https://logos-world.net/wp-content/uploads/2023/02/Traktor-Logo.png', type: 'dj_software', website: 'https://www.native-instruments.com/en/products/traktor/' },
  { id: 'ableton', name: 'Ableton Live', logo: 'https://logos-world.net/wp-content/uploads/2023/02/Ableton-Logo.png', type: 'daw', website: 'https://www.ableton.com/en/live/' }
];

const DJEquipment: React.FC<DJEquipmentProps> = ({ profile, isOwnProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    equipment: profile.equipment || { hardware: [], software: [] }
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      equipment: profile.equipment || { hardware: [], software: [] }
    });
    setIsEditing(false);
  };

  const addHardware = (brand: EquipmentBrand) => {
    if (!editData.equipment.hardware.find(h => h.id === brand.id)) {
      setEditData({
        ...editData,
        equipment: {
          ...editData.equipment,
          hardware: [...editData.equipment.hardware, brand]
        }
      });
    }
  };

  const removeHardware = (brandId: string) => {
    setEditData({
      ...editData,
      equipment: {
        ...editData.equipment,
        hardware: editData.equipment.hardware.filter(h => h.id !== brandId)
      }
    });
  };

  const addSoftware = (brand: SoftwareBrand) => {
    if (!editData.equipment.software.find(s => s.id === brand.id)) {
      setEditData({
        ...editData,
        equipment: {
          ...editData.equipment,
          software: [...editData.equipment.software, brand]
        }
      });
    }
  };

  const removeSoftware = (brandId: string) => {
    setEditData({
      ...editData,
      equipment: {
        ...editData.equipment,
        software: editData.equipment.software.filter(s => s.id !== brandId)
      }
    });
  };

  const userRole = 'dj';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display neon-text">Equipment & Software</h2>
        {isOwnProfile && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  <Save size={16} className="mr-2" />
                  Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                <Edit3 size={16} className="mr-2" />
                Edit Setup
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hardware Equipment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Settings size={20} className="mr-2 text-cyan-400" />
          Hardware Equipment
          {isOwnProfile && !isProfileFieldComplete(profile, 'equipment.hardware') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Hardware" 
                importance="medium"
              />
            </span>
          )}
        </h3>

        {/* Current Hardware */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {(isEditing ? editData.equipment.hardware : profile.equipment?.hardware || []).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gray-800/50 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={item.logo} alt={item.name} className="w-8 h-8 object-contain mr-3" />
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{item.category}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {item.website && !isEditing && (
                    <a 
                      href={getBrandAffiliateLink({
                        id: item.id,
                        name: item.name,
                        logo: item.logo,
                        type: 'dj_equipment',
                        website: item.website,
                        aliases: [item.name.toLowerCase()]
                      }, userRole)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-700 rounded-full transition-colors mr-1"
                    >
                      <ExternalLink size={14} className="text-cyan-400" />
                    </a>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => removeHardware(item.id)}
                      className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                      <X size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {(isEditing ? editData.equipment.hardware : profile.equipment?.hardware || []).length === 0 && (
            <div className="col-span-full p-4 bg-gray-800/50 rounded-lg text-center">
              <p className="text-gray-400">
                {isOwnProfile 
                  ? 'Add your DJ equipment to complete your profile' 
                  : 'No equipment information available'}
              </p>
            </div>
          )}
        </div>

        {/* Add Hardware */}
        {isEditing && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Add Equipment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EQUIPMENT_BRANDS.filter(brand => 
                !editData.equipment.hardware.find(h => h.id === brand.id)
              ).map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => addHardware(brand)}
                  className="flex items-center p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all"
                >
                  <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{brand.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{brand.category}</div>
                  </div>
                  <Plus size={16} className="ml-auto text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Software */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Settings size={20} className="mr-2 text-purple-400" />
          Software & DAWs
          {isOwnProfile && !isProfileFieldComplete(profile, 'equipment.software') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Software" 
                importance="medium"
              />
            </span>
          )}
        </h3>

        {/* Current Software */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {(isEditing ? editData.equipment.software : profile.equipment?.software || []).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gray-800/50 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={item.logo} alt={item.name} className="w-8 h-8 object-contain mr-3" />
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{item.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {item.website && !isEditing && (
                    <a 
                      href={getBrandAffiliateLink({
                        id: item.id,
                        name: item.name,
                        logo: item.logo,
                        type: 'dj_software',
                        website: item.website,
                        aliases: [item.name.toLowerCase()]
                      }, userRole)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-700 rounded-full transition-colors mr-1"
                    >
                      <ExternalLink size={14} className="text-purple-400" />
                    </a>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => removeSoftware(item.id)}
                      className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                      <X size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {(isEditing ? editData.equipment.software : profile.equipment?.software || []).length === 0 && (
            <div className="col-span-full p-4 bg-gray-800/50 rounded-lg text-center">
              <p className="text-gray-400">
                {isOwnProfile 
                  ? 'Add your DJ software to complete your profile' 
                  : 'No software information available'}
              </p>
            </div>
          )}
        </div>

        {/* Add Software */}
        {isEditing && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Add Software</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SOFTWARE_BRANDS.filter(brand => 
                !editData.equipment.software.find(s => s.id === brand.id)
              ).map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => addSoftware(brand)}
                  className="flex items-center p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all"
                >
                  <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{brand.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{brand.type.replace('_', ' ')}</div>
                  </div>
                  <Plus size={16} className="ml-auto text-purple-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DJEquipment;