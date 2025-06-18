// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'
// import fs from 'fs'
// import path from 'path'

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')
//   const useHttps = env.USE_HTTPS === 'true'

//   return {
//     plugins: [react()],
//     server: {
//       https: useHttps
//         ? {
//             key: fs.readFileSync(path.resolve(__dirname, './cert.key')),
//             cert: fs.readFileSync(path.resolve(__dirname, './cert.crt')),
//           }
//         : false,
//       host: true,
//     },
//   }
// })
 

/////////////////////////////////////////////////////////////////////////////////////


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import fs from 'fs'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync('./cert.key'),
//       cert: fs.readFileSync('./cert.crt')
//     },
//     host: true
//   }
// })


/////////////////////////////////////////////////////////////////////////////////////
 

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


/////////////////////////////////////////////////////////////////////////////////////


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',    // ← allows access from local network
    port: 5173,         // ← you can change this if needed
    strictPort: true,   // ← optional: ensures port doesn't auto-increment
  },
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// // 