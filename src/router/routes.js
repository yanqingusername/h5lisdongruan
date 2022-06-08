import Login from '../pages/login/login.vue'
import Page404 from '../pages/page404/index.vue'
import lisList from '../pages/lisList.vue'
import lisMain from '../pages/lisMain.vue'
import instrumentPDF from '../pages/instrumentPDF.vue'
import lisInfo from '../pages/lisInfo.vue'
import lisInfoGroup from '../pages/lisInfoGroup.vue'
import lisInfoCustom from '../pages/lisInfoCustom.vue'
import lisDetail from '../pages/lisDetail.vue';
import lisDetailInfo from '../pages/lisDetailInfo.vue';
import lisDetailInfoBox from '../pages/lisDetailInfoBox.vue';
import lisDetailInfoSearch from '../pages/lisDetailInfoSearch.vue';
import lisDetailInfoBoxSearch from '../pages/lisDetailInfoBoxSearch.vue';


const routes = [{
        path: '/login',
        component: Login
    },
    {
        path:"/lisList",
        component: lisList
    },
    {
        path:"/lisMain",
        component: lisMain
    },
    {
        path:"/instrumentPDF",
        component: instrumentPDF
    },
    {
        path:"/lisInfo",
        component: lisInfo
    },
    {
        path:"/lisInfoGroup",
        component: lisInfoGroup
    },
    {
        path:"/lisInfoCustom",
        component: lisInfoCustom
    },
    {
        path:'/lisDetail',
        component: lisDetail
    },
    {
        path:'/lisDetailInfo',
        component: lisDetailInfo
    },
    {
        path:'/lisDetailInfoBox',
        component: lisDetailInfoBox
    },
    {
        path:'/lisDetailInfoSearch',
        component: lisDetailInfoSearch
    },
    {
        path:'/lisDetailInfoBoxSearch',
        component: lisDetailInfoBoxSearch
    },
    {
        path: '/',
        component: Login
    },
    {
        path: '*',
        component: Page404 //404页面
    }
]

export default routes