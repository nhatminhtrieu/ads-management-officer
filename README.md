# Ads Management Resident Website

## Installation

### Steps

1. Clone repo.

2. Install required packages

   - Run `npm i`

   - When install package, run `npm install <package-name>`.

3. Run localhost:

   - Run `npm start`.

   - Navigate to `localhost:3456/static/html/map.html`.

## Folder Structure

```shell
ads-management-resident
├── database
│     ├── models
│     │    └── <ModelName>.js                   # Model's schema declaration
│     ├── repositories
│     │    └── <RepositoryName>.js              # Repository declaration
│     └── Connection.js                         # Database connection
├── routes                                      # Routes declaration
│     └── <RouteName>.js
├── services                                    # Database services declaration
│     └── <ServiceName>.js
└── static
      ├── assets
      ├── html
      ├── js                                    # Functions
      │    ├── ...
      │    └── service                          # Render services declaration
      └── style                                 # Styling folder
```

## Available Scripts

- `npm start`: Run localhost
