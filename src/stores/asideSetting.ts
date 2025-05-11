import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAsideSettingStore = defineStore('asideSetting', () => {
  const fold = ref(false)
  function changeFold(){
    fold.value = !fold.value
  }

  const refresh = ref(true) //this value do not matter

  return { fold,changeFold,refresh }
})
