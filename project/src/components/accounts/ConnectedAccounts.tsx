@@ .. @@
              <div className="p-4 bg-gray-800/50 rounded-lg flex items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mr-4">
-                    <svg viewBox="0 0 24 24" className="w-6 h-6">
-                      <path
-                        fill="white"
-                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
-                      />
-                    </svg>
+                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
+                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
+                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-lg">X (Twitter)</div>
                    <div className="text-sm text-gray-400">
                      {connectedProviders.includes('twitter') 
                        ? 'Conectado' 
                        : 'No conectado'}
                    </div>
                  </div>
                </div>
                
                {connectedProviders.includes('twitter') ? (
                  <button
                    onClick={() => handleDisconnectProvider('twitter')}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    disabled={isLoading || connectedProviders.length <= 1}
                    title={connectedProviders.length <= 1 ? "Debes tener al menos un método de acceso" : ""}
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnectProvider('twitter')}
                    className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors"
                    disabled={isLoading}
                  >
                    Conectar
                  </button>
                )}
              </div>
            </div>
          </motion.div>