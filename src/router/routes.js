import Login from '../pages/login/login.vue'
import Page404 from '../pages/page404/index.vue'
import lisMain from '../pages/lisMain.vue'
import instrumentPDF from '../pages/instrumentPDF.vue'
import lisInfoCustom from '../pages/lisInfoCustom.vue'
import lisDetail from '../pages/lisDetail.vue';
import lisDetailInfo from '../pages/lisDetailInfo.vue';
import lisDetailInfoBox from '../pages/lisDetailInfoBox.vue';
import lisDetailInfoSearch from '../pages/lisDetailInfoSearch.vue';
import lisDetailInfoBoxSearch from '../pages/lisDetailInfoBoxSearch.vue';


const routes = [{
        path: '/login',
        meta:{title: '登录'},
        component: Login
    },
    {
        path:"/lisMain",
        meta:{title: '卡尤迪新冠核酸检测信息采集系统'},
        component: lisMain
    },
    {
        path:"/instrumentPDF",
        component: instrumentPDF
    },
    {
        path:"/lisInfoCustom",
        meta:{title:'采样点人员信息登记'},
        component: lisInfoCustom
    },
    {
        path:'/lisDetail',
        meta:{title:'箱码详情'},
        component: lisDetail
    },
    {
        path:'/lisDetailInfo',
        meta:{title:'已采集信息'},
        component: lisDetailInfo
    },
    {
        path:'/lisDetailInfoBox',
        meta:{title:'箱码详情'},
        component: lisDetailInfoBox
    },
    {
        path:'/lisDetailInfoSearch',
        meta:{title:'搜索'},
        component: lisDetailInfoSearch
    },
    {
        path:'/lisDetailInfoBoxSearch',
        meta:{title:'搜索'},
        component: lisDetailInfoBoxSearch
    },
    {
        path: '/',
        meta:{title: '登录'},
        component: Login
    },
    {
        path: '*',
        component: Page404 //404页面
    }
]

export default routes