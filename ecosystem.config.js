module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'plan_tour_server',
      script    : './index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'yangpeng',
      host : '47.52.143.59',
      ref  : 'origin/master',
      repo : 'https://github.com/aitexiaoy/plan_tour_server.git',
      path : '/home/yangpeng/web/plan_tour_server/deploy',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'yangpeng',
      host : '47.52.143.59',
      ref  : 'origin/master',
      repo : 'https://github.com/aitexiaoy/plan_tour_server.git',
      path : '/home/yangpeng/web/plan_tour_server/dev',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
