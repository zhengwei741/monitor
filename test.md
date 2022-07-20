      body: "{
        exception: {
          values: [
            {
              type: 'Error',
              value: 'externalLibrary method broken: 1610509422407',
              stacktrace: {
                frames: [
                  {
                    colno: 1,
                    filename:
                      'https://rawgit.com/kamilogorek/cfbe9f92196c6c61053b28b2d42e2f5d/raw/3aef6ff5e2fd2ad4a84205cd71e2496a445ebe1d/external-lib.js',
                    function: '?',
                    in_app: true,
                    lineno: 5,
                  },
                  {
                    colno: 9,
                    filename:
                      'https://rawgit.com/kamilogorek/cfbe9f92196c6c61053b28b2d42e2f5d/raw/3aef6ff5e2fd2ad4a84205cd71e2496a445ebe1d/external-lib.js',
                    function: 'externalLibrary',
                    in_app: true,
                    lineno: 2,
                  },
                ],
              },
              mechanism: { handled: false, type: 'onerror' },
            },
          ],
        },
        platform: 'javascript',
        sdk: {
          name: 'sentry.javascript.browser',
          packages: [{ name: 'npm:@sentry/browser', version: '5.29.2' }],
          version: '5.29.2',
          integrations: [
            'InboundFilters',
            'FunctionToString',
            'TryCatch',
            'Breadcrumbs',
            'GlobalHandlers',
            'LinkedErrors',
            'UserAgent',
          ],
        },
        event_id: 'aec2b5cdf4b34efa92c4766ea76a2f4b',
        timestamp: 1610509422.9,
        environment: 'staging',
        release: '1537345109360',
        breadcrumbs: [
          {
            timestamp: 1610509411.46,
            category: 'console',
            data: {
              arguments: [
                'currentHub',
                { _version: 3, _stack: '[Array]', _lastEventId: 'aec2b5cdf4b34efa92c4766ea76a2f4b' },
              ],
              logger: 'console',
            },
            level: 'log',
            message: 'currentHub [object Object]',
          },
          {
            timestamp: 1610509411.462,
            category: 'console',
            data: { arguments: ['Time Hooker Works!'], logger: 'console' },
            level: 'log',
            message: 'Time Hooker Works!',
          },
          { timestamp: 1610509411.52, category: 'ui.click', message: 'body > button#plainObject' },
          { timestamp: 1610509415.083, category: 'ui.click', message: 'body > button#deny-url' },
          { timestamp: 1610509416.768, category: 'ui.click', message: 'body > button#deny-url' },
          {
            timestamp: 1610509422.405,
            category: 'sentry.event',
            event_id: 'b91c3bbff53047b7b6b40cd87a82c88e',
            message: 'Error: externalLibrary method broken: 1610509417092',
          },
        ],
        request: {
          url: 'http://127.0.0.1:5500/packages/browser/examples/index.html',
          headers: {
            Referer: 'http://127.0.0.1:5500/packages/browser/examples/index.html',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
          },
        },
        tags: {},
      }",
      type: 'event',
      url: 'https://sentry.io/api/297378/store/?sentry_key=363a337c11a64611be4845ad6e24f3ac&sentry_version=7',

body 里的exception 错误内容
sdk 具体使用sdk的版本，还有集成
breadcrumbs面包屑内容
request 当前发起请求的路径内容
url是发向后端的api

reportData
