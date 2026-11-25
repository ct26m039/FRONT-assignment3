import { ref } from 'vue'

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const canInstall = ref(false)

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt.value = event as BeforeInstallPromptEvent
    canInstall.value = true          // replaces showInstallButton()
})

export function useInstallPrompt() {
    async function installApp() {
        if (!deferredPrompt.value) return
        await deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        deferredPrompt.value = null
        canInstall.value = false
        console.log('Install outcome:', outcome)   // replaces trackInstall/trackDismiss
    }
    return { canInstall, installApp }
}