import router from "."
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { useUserStore } from "@/stores/user";

NProgress.configure({ showSpinner: false }); // Disable the loading spinner

//execute before route jump
router.beforeEach(async (to, form, next) => {
    NProgress.start(); // Start the progress bar

    //get token from user store
    const userStore = useUserStore()
    let token = userStore.token
    if (token) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        if (userStore.infoReady) {
          next()
        } else {
          try {
            await userStore.userInfo()
            next({ ...to })
          } catch (error) {
            await userStore.logOut()
            next({ path: '/login', query: { redirect: to.path } })
          }
        }
      }
    } else {
      if (to.path == '/login') {
        next()
      } else {
        next({ path: '/login', query: { redirect: to.path } })
      }
    }
})


//execute after route jump
router.afterEach((to,form) => {
    //set title
    document.title = to.meta.title as string

    NProgress.done(); // Stop the progress bar
})