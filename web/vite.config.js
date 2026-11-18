import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// While previewing inside the Base44 sandbox the page is opened through a proxy
// whose hostname rotates. Only widen the allowlist when the preview flag is set;
// normal development keeps Vite's default behavior.
const previewHosts = []
if (process.env.BASE44_PREVIEW_MODE === '1') {
  if (process.env.BASE44_SANDBOX_HOST_DOMAIN) {
    previewHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`)
  }
  if (process.env.BASE44_PUBLIC_HOST_SUFFIX) {
    previewHosts.push(`.${process.env.BASE44_PUBLIC_HOST_SUFFIX}`)
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: previewHosts,
  },
})
