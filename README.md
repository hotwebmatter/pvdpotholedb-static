# pvdpotholedb-static

Static site fails to deploy to Netlify:
```
2:05:52 PM: Build ready to start
2:05:54 PM: build-image version: 53b83b6bede2920f236b25b6f5a95334320dc849
2:05:54 PM: build-image tag: v3.6.0
2:05:54 PM: buildbot version: 94ed42511c4e70547a960237db686b74875fef2d
2:05:54 PM: Fetching cached dependencies
2:05:54 PM: Failed to fetch cache, continuing with build
2:05:54 PM: Starting to prepare the repo for build
2:05:55 PM: No cached dependencies found. Cloning fresh repo
2:05:55 PM: git clone https://github.com/hotwebmatter/pvdpotholedb-static
2:05:56 PM: Preparing Git Reference refs/heads/main
2:05:58 PM: No build steps found, continuing to publishing
2:05:58 PM: Starting to deploy site from '/'
2:05:58 PM: Failing build: Failed to deploy site
2:05:58 PM: Failed during stage 'deploying site': Invalid filename 'fonts/glyphicons-halflings-regular.eot?'. Deployed filenames cannot contain # or ? characters
2:05:58 PM: Finished processing build request in 3.879404224s
```
