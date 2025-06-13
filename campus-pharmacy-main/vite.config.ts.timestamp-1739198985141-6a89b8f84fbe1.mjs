// vite.config.ts
import { defineConfig } from "file:///D:/PROJECTS/Apps/PHARM%20FINDER/Pharmar-Finder/campus-pharmacy-main/node_modules/vite/dist/node/index.js";
import react from "file:///D:/PROJECTS/Apps/PHARM%20FINDER/Pharmar-Finder/campus-pharmacy-main/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Expose to all network interfaces
    port: 5173
    // Default Vite port
  },
  define: {
    "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
    "process.env.SUPABASE_ANON_KEY": JSON.stringify(process.env.SUPABASE_ANON_KEY)
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQUk9KRUNUU1xcXFxBcHBzXFxcXFBIQVJNIEZJTkRFUlxcXFxQaGFybWFyLUZpbmRlclxcXFxjYW1wdXMtcGhhcm1hY3ktbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUFJPSkVDVFNcXFxcQXBwc1xcXFxQSEFSTSBGSU5ERVJcXFxcUGhhcm1hci1GaW5kZXJcXFxcY2FtcHVzLXBoYXJtYWN5LW1haW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1BST0pFQ1RTL0FwcHMvUEhBUk0lMjBGSU5ERVIvUGhhcm1hci1GaW5kZXIvY2FtcHVzLXBoYXJtYWN5LW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IHRydWUsIC8vIEV4cG9zZSB0byBhbGwgbmV0d29yayBpbnRlcmZhY2VzXG4gICAgcG9ydDogNTE3MywgLy8gRGVmYXVsdCBWaXRlIHBvcnRcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52LlNVUEFCQVNFX1VSTCc6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlNVUEFCQVNFX1VSTCksXG4gICAgJ3Byb2Nlc3MuZW52LlNVUEFCQVNFX0FOT05fS0VZJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuU1VQQUJBU0VfQU5PTl9LRVkpLFxuICB9XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ZLFNBQVMsb0JBQW9CO0FBQ2hhLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxFQUNSO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTiw0QkFBNEIsS0FBSyxVQUFVLFFBQVEsSUFBSSxZQUFZO0FBQUEsSUFDbkUsaUNBQWlDLEtBQUssVUFBVSxRQUFRLElBQUksaUJBQWlCO0FBQUEsRUFDL0U7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
