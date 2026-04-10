<script setup>
import { ref, onMounted } from 'vue'
import { getRepos } from './services/github'
import { getWeather, getWeatherStatus } from './services/weather'
import { checkServiceStatus } from './services/monitor'

const currentTime = ref(new Date().toLocaleTimeString())
const repos = ref([])
const weather = ref(null)
const systemNodes = ref([])
const loading = ref(true)
const command = ref('')
const lastCommand = ref('Esperando entrada...')

const executeCommand = () => {
  const cmd = command.value.toLowerCase().trim()
  
  if (cmd === 'help') {
    lastCommand.value = 'Comandos: open [name], clear, health, about'
  } else if (cmd.startsWith('open ')) {
    const target = cmd.split(' ')[1]
    const sites = {
      'medicina': 'https://portal-medicina-8pfk81fsf-defcarlosasnps-projects.vercel.app/',
      'spa': 'https://defcarlosasnp.github.io/Peumayen-spa/',
      'portafolio': 'https://defcarlosasnp.github.io/portafolio/',
      'tcg': 'https://tcg-buin.wuaze.com/'
    }
    if (sites[target]) {
      window.open(sites[target], '_blank')
      lastCommand.value = `Abriendo ${target}...`
    } else {
      lastCommand.value = 'Error: Sitio no encontrado.'
    }
  } else if (cmd === 'clear') {
    lastCommand.value = 'Consola limpia.'
  } else {
    lastCommand.value = `Comando no reconocido: ${cmd}`
  }
  
  command.value = ''
}

onMounted(async () => {
  const [reposData, weatherData, nodesData] = await Promise.all([
    getRepos('defcarlosasnp'),
    getWeather(),
    checkServiceStatus([
      { name: 'PEUMAYEN_SPA', url: 'https://defcarlosasnp.github.io/Peumayen-spa/' },
      { name: 'PORTAL_MEDICINA', url: 'https://portal-medicina-8pfk81fsf-defcarlosasnps-projects.vercel.app/' },
      { name: 'PORTAFOLIO_V1', url: 'https://defcarlosasnp.github.io/portafolio/' },
      { name: 'TCG_BUIN_CMS', url: 'https://tcg-buin.wuaze.com/' }
    ])
  ]);
  
  repos.value = reposData;
  weather.value = weatherData;
  systemNodes.value = nodesData;
  loading.value = false;
})

setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString()
}, 1000)
</script>

<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-400 font-mono p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
    
    <header class="max-w-7xl mx-auto flex justify-between items-center border-b border-zinc-800 pb-4 mb-8">
      <div class="flex items-center gap-3">
        <div class="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
        <h1 class="text-lg font-bold text-zinc-100 tracking-tighter uppercase">
          Dev_Terminal <span class="text-zinc-600 font-normal">v4.0</span>
        </h1>
      </div>
      <div class="text-right text-[10px] md:text-xs space-y-1 uppercase tracking-widest">
        <p class="text-zinc-500">User: <span class="text-zinc-200">Carlos_Calderon</span></p>
        <p class="text-emerald-500 font-bold">{{ currentTime }}</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
      
      <section class="md:col-span-8 border border-zinc-800 bg-zinc-900/20 rounded-xl p-6 relative group overflow-hidden">
        <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </div>
        
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
          <span class="w-2 h-2 bg-zinc-700 rounded-full"></span>
          Project_Activity
        </h2>

        <div v-if="loading" class="h-64 flex items-center justify-center border border-zinc-800/50 rounded-lg border-dashed">
          <p class="text-xs text-zinc-600 animate-pulse italic">EJECUTANDO_PROTOCOLO_DE_BUSQUEDA...</p>
        </div>
        
        <div v-else class="grid gap-3">
          <div v-for="repo in repos" :key="repo.id" class="p-3 border border-zinc-800/50 rounded bg-black/40 hover:border-emerald-500/50 transition-colors group">
            <div class="flex justify-between items-start">
              <h3 class="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 uppercase tracking-tighter">
                {{ repo.name }}
              </h3>
              <span class="text-[10px] text-zinc-600">{{ repo.language || 'Plain Text' }}</span>
            </div>
            <p class="text-[11px] text-zinc-500 truncate mt-1">{{ repo.description || 'Sin descripción disponible' }}</p>
          </div>
        </div>
      </section>

      <div class="md:col-span-4 space-y-6 text-sm">
        
        <section class="border border-zinc-800 bg-zinc-900/20 rounded-xl p-5">
          <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">System_Nodes_Health</h2>
          <div v-if="systemNodes.length" class="space-y-4">
            <div v-for="node in systemNodes" :key="node.name" class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div :class="[
                  'h-1.5 w-1.5 rounded-full shadow-[0_0_8px]',
                  node.status === 'ONLINE' ? 'bg-emerald-500 shadow-emerald-500' : 'bg-red-500 shadow-red-500'
                ]"></div>
                <span class="text-[11px] font-bold text-zinc-300 tracking-wider group-hover:text-zinc-100 transition-colors">
                  {{ node.name }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-[9px] text-zinc-600 uppercase leading-none mb-1">Latency</p>
                <p class="text-[10px] font-mono text-zinc-400">{{ node.latency }}</p>
              </div>
            </div>
          </div>
          <div v-else class="py-2 animate-pulse flex flex-col gap-2">
            <div v-for="i in 3" :key="i" class="h-4 bg-zinc-800/50 rounded w-full"></div>
          </div>
        </section>

        <section class="border border-zinc-800 bg-zinc-900/20 rounded-xl p-5 relative overflow-hidden">
          <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Environment</h2>
          <div v-if="weather" class="flex items-end gap-3">
            <span class="text-4xl font-light text-zinc-100">{{ Math.round(weather.temperature_2m) }}°C</span>
            <div class="pb-1">
              <p class="text-[10px] leading-none uppercase text-emerald-500 font-bold mb-1">
                {{ getWeatherStatus(weather.weather_code) }}
              </p>
              <p class="text-xs text-zinc-300 font-bold">Santiago, CL</p>
            </div>
          </div>
          <div v-if="weather" class="mt-4 pt-4 border-t border-zinc-800/50">
            <div class="flex justify-between text-[10px] mb-1">
              <span class="text-zinc-500 uppercase">Humidity</span>
              <span class="text-zinc-300">{{ weather.relative_humidity_2m }}%</span>
            </div>
            <div class="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-1000" :style="{ width: weather.relative_humidity_2m + '%' }"></div>
            </div>
          </div>
          <div v-else class="py-4 animate-pulse text-zinc-700 text-xs italic">BUSCANDO_SATELITE...</div>
        </section>

      </div>
    </main>

    <footer class="max-w-7xl mx-auto mt-12 pt-4 border-t border-zinc-900/50">
      <div class="flex flex-col gap-2">
        <div class="text-[10px] text-zinc-600 font-mono italic uppercase">
          LAST_LOG: {{ lastCommand }}
        </div>
        <div class="flex items-center gap-2 text-sm text-zinc-400">
          <span class="text-emerald-500 font-bold">~</span>
          <span class="text-zinc-600">/carlos_calderon</span>
          <input 
            v-model="command"
            @keyup.enter="executeCommand"
            type="text"
            class="bg-transparent border-none outline-none flex-1 text-emerald-400 font-mono focus:ring-0"
            placeholder="escribe 'help'..."
          />
        </div>
      </div>
    </footer>

  </div>
</template>