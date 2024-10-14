const routes = [
  {
    path: "/consultar",
    component: () => import("layouts/NoLayout2.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/TableResult.vue"),
        meta: { requiresAuth: false },
      },
    
       ] },
       {
        path: "/pie",
        component: () => import("layouts/NoLayout2.vue"),
        children: [
          {
            path: "",
            component: () => import("pages/PieResult2.vue"),
            meta: { requiresAuth: false },
          },
        
           ] },
        {
        path: "/pie2",
        component: () => import("layouts/NoLayout2.vue"),
        children: [
          {
            path: "",
            component: () => import("pages/PieResult3.vue"),
            meta: { requiresAuth: false },
          },
        
            ] },
      
  {
    path: "/",
    component: () => import("layouts/NoLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/LoginPage.vue"),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/consulta",
        component: () => import("pages/ConsultarSolicitud.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/listado",
        component: () => import("pages/ListadoSolicitud.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
