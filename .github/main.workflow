workflow "Deploy" {
  on = "create"
  resolves = ["WordPress Plugin Deploy"]
}

# Filter for tag
action "tag" {
    uses = "actions/bin/filter@master"
    args = "tag"
}

action "WordPress Plugin Deploy" {
  needs = ["tag"]
  uses = "rtCamp/action-wordpress-org-plugin-deploy@master"
  secrets = ["WORDPRESS_USERNAME", "WORDPRESS_PASSWORD"]
  env = {
    SLUG = "gitblock"
    ASSETS_DIR = "wp_assets"
    EXCLUDE_LIST = "demo vendor .babelrc .editorconfig .eslintignore .eslintrc .gitignore .jscsrc .jshintignore .npmrc .nvmrc LICENSE README.md composer.json composer.lock package-lock.json package.json phpcs.xml webpack.config.js"
  }
}
