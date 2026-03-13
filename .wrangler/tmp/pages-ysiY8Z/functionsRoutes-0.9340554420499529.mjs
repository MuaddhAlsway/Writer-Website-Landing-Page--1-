import { onRequestPost as __api_admin_login_ts_onRequestPost } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\admin\\login.ts"
import { onRequestPost as __api_newsletters_send_ts_onRequestPost } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\newsletters\\send.ts"
import { onRequest as __api_admin_forgot_password_ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\admin\\forgot-password.ts"
import { onRequest as __api_admin_profile_ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\admin\\profile.ts"
import { onRequest as __api_admin_reset_password_ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\admin\\reset-password.ts"
import { onRequestGet as __api_newsletters_ts_onRequestGet } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\newsletters.ts"
import { onRequestPost as __api_newsletters_ts_onRequestPost } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\newsletters.ts"
import { onRequestPost as __api_send_email_ts_onRequestPost } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\send-email.ts"
import { onRequestGet as __api_stats_ts_onRequestGet } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\stats.ts"
import { onRequestGet as __api_subscribers_ts_onRequestGet } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\subscribers.ts"
import { onRequestPost as __api_subscribers_ts_onRequestPost } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\subscribers.ts"
import { onRequest as __api_send_email_worker_ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\send-email-worker.ts"
import { onRequest as __api___route___ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\api\\[[route]].ts"
import { onRequest as __make_server_53bed28f___route___ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\make-server-53bed28f\\[[route]].ts"
import { onRequest as ____route___ts_onRequest } from "C:\\Users\\muadd\\Downloads\\Writer Website Landing Page (1)\\functions\\[[route]].ts"

export const routes = [
    {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_ts_onRequestPost],
    },
  {
      routePath: "/api/newsletters/send",
      mountPath: "/api/newsletters",
      method: "POST",
      middlewares: [],
      modules: [__api_newsletters_send_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/forgot-password",
      mountPath: "/api/admin",
      method: "",
      middlewares: [],
      modules: [__api_admin_forgot_password_ts_onRequest],
    },
  {
      routePath: "/api/admin/profile",
      mountPath: "/api/admin",
      method: "",
      middlewares: [],
      modules: [__api_admin_profile_ts_onRequest],
    },
  {
      routePath: "/api/admin/reset-password",
      mountPath: "/api/admin",
      method: "",
      middlewares: [],
      modules: [__api_admin_reset_password_ts_onRequest],
    },
  {
      routePath: "/api/newsletters",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_newsletters_ts_onRequestGet],
    },
  {
      routePath: "/api/newsletters",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_newsletters_ts_onRequestPost],
    },
  {
      routePath: "/api/send-email",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_send_email_ts_onRequestPost],
    },
  {
      routePath: "/api/stats",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_stats_ts_onRequestGet],
    },
  {
      routePath: "/api/subscribers",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_subscribers_ts_onRequestGet],
    },
  {
      routePath: "/api/subscribers",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscribers_ts_onRequestPost],
    },
  {
      routePath: "/api/send-email-worker",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_send_email_worker_ts_onRequest],
    },
  {
      routePath: "/api/:route*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___route___ts_onRequest],
    },
  {
      routePath: "/make-server-53bed28f/:route*",
      mountPath: "/make-server-53bed28f",
      method: "",
      middlewares: [],
      modules: [__make_server_53bed28f___route___ts_onRequest],
    },
  {
      routePath: "/:route*",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [____route___ts_onRequest],
    },
  ]