import { useUserStore } from "@/stores/user";
import pinia from '@/stores/setupPinia';

const userStore = useUserStore(pinia)

//remove button that user don't have
export const hasButton = (app:any) => {
    app.directive('button',{
        mounted(el:any, options:any) {
            if(!userStore.userButton.includes(options.value)){
                el.parentNode.removeChild(el)
            }
        },
    })
}