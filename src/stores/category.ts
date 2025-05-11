import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CategoryObj, CategoryResponseData, PropertiesResponseData, PropertiesObj } from '@/api/goods/properties/type'
import { reqCategory1, reqCategory2, reqCategory3, reqPropList } from '@/api/goods/properties'

export const useCategoryStore = defineStore('category', () => {
    const category1Arr = ref<CategoryObj[]>([])
    //use to collect the id of selected category1
    const category1Id = ref<number|undefined>(undefined)
    const category2Arr = ref<CategoryObj[]>([])
    //use to collect the id of selected category2
    const category2Id = ref<number|undefined>(undefined)
    const category3Arr = ref<CategoryObj[]>([])
    //use to collect the id of selected category3
    const category3Id = ref<number|undefined>(undefined)

    const reset = () => {
        category1Id.value = undefined
        category2Id.value = undefined
        category3Id.value = undefined
        category1Arr.value = []
        category2Arr.value = []
        category3Arr.value = []
    }

    const getCategory1 = async () => {
        const result:CategoryResponseData = await reqCategory1()

        if(result.code === 1){
            category1Arr.value = result.data

            return 'ok'
        } else {
            return Promise.reject(new Error(result.msg))
        }
    }

    const getCategory2 = async () => {
        // Ensure category1Id is not undefined before making the request
        if (category1Id.value !== undefined) {
            const result: CategoryResponseData = await reqCategory2(category1Id.value);
    
            if (result.code === 1) {
                category2Arr.value = result.data;
                return 'ok';
            } else {
                return Promise.reject(new Error(result.msg));
            }
        } else {
            // Handle the case where category1Id is undefined
            return Promise.reject(new Error('Category 1 ID is undefined'));
        }
    };

    const getCategory3 = async () => {
        // Ensure category1Id is not undefined before making the request
        if (category2Id.value !== undefined) {
            const result: CategoryResponseData = await reqCategory3(category2Id.value);
    
            if (result.code === 1) {
                category3Arr.value = result.data;
                return 'ok';
            } else {
                return Promise.reject(new Error(result.msg));
            }
        } else {
            // Handle the case where category1Id is undefined
            return Promise.reject(new Error('Category 1 ID is undefined'));
        }
    };

    const propertiesList = ref<PropertiesObj[]>([])

    const getPropList = async () => {
        const result: PropertiesResponseData = await reqPropList(category1Id.value, category2Id.value, category3Id.value)

            if(result.code === 1){
                 propertiesList.value = result.data
            } else {
                return Promise.reject(new Error(result.msg));
            }
    }

    watch(category3Id, (newValue) => {
        propertiesList.value = []

        if(newValue !== undefined){
            getPropList()
        }
    })

    return { category1Arr, category1Id, category2Arr, category2Id, category3Arr, category3Id, getCategory1, getCategory2, getCategory3, propertiesList, getPropList, reset }
})