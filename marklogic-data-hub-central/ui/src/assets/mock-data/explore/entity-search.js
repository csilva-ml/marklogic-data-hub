export const entitySearch = {
  "snippet-format": "snippet",
  "total": 5,
  "start": 1,
  "page-length": 10,
  "selected": "include",
  "results": [
    {
      "index": 1,
      "uri": "/Customer/Cust1.json",
      "documentSize": {
        "value": 815,
        "units": "B"},
      "primaryKey": {
        "propertyPath": "customerId",
        "propertyValue": 101
      },
      "path": "fn:doc(\"/Customer/Cust1.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust1.json",
      "mimetype": "application/json",
      "format": "json",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust1.json\")/object-node()",
          "match-text": [
            "Customer 0.0.1 http://example.org/ Carmella Hardin Carm din Whitwell Place Ellerslie Georgia 52239 1718 Whitwell Place2 Ellerslie2 Georgia 52239 1718 Anna Court Stewart Kansas 62601"
          ]
        }
      ],
      "entityProperties": [
        {
          "propertyPath": "customerId",
          "propertyValue": 101
        },
        {
          "propertyPath": "name",
          "propertyValue": "Carmella Hardin"
        },
        {
          "propertyPath": "nicknames",
          "propertyValue": [
            "Carm",
            "din",
            "",
            null
          ]
        },
        {
          "propertyPath": "shipping",
          "propertyValue": [
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Whitwell Place"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Ellerslie"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Georgia"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "52239"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "1718"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Whitwell Place2"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Ellerslie2"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Georgia"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "52239"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "1718"
                    }
                  ]
                ]
              }
            ]
          ]
        },
        {
          "propertyPath": "billing",
          "propertyValue": [
            [
              {
                "propertyPath": "billing.street",
                "propertyValue": "Anna Court"
              },
              {
                "propertyPath": "billing.city",
                "propertyValue": "Stewart"
              },
              {
                "propertyPath": "billing.state",
                "propertyValue": "Kansas"
              },
              {
                "propertyPath": "billing.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "billing.zip.fiveDigit",
                      "propertyValue": "62601"
                    },
                    {
                      "propertyPath": "billing.zip.plusFour",
                      "propertyValue": "6783"
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ],
      "hubMetadata": {
        "lastProcessedByFlow": "personJSON",
        "lastProcessedByStep": "mapPersonJSON",
        "lastProcessedDateTime": "2020-10-09T15:08:29.234563-07:00",
        "sources": [
          {
            "datahubSourceName": "loadPersonJSON",
            "datahubSourceType": "loadPersonJSONType"
          }
        ]
      }
    },
    {
      "index": 2,
      "uri": "/Customer/Cust2.json",
      "primaryKey": {
        "propertyPath": "customerId",
        "propertyValue": 102
      },
      "path": "fn:doc(\"/Customer/Cust2.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust2.json",
      "mimetype": "application/json",
      "format": "json",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust2.json\")/object-node()",
          "match-text": [
            "Customer 0.0.1 http://example.org/ Adams Cole ad coley Lefferts Place Marenisco Maryland 44582 8427 Lefferts Place Marenisco Maryland 44582 8427 Varick Avenue Mooresburg Delaware 17654"
          ]
        }
      ],
      "entityProperties": [
        {
          "propertyPath": "customerId",
          "propertyValue": 102
        },
        {
          "propertyPath": "name",
          "propertyValue": "Adams Cole"
        },
        {
          "propertyPath": "nicknames",
          "propertyValue": [
            "ad",
            "coley"
          ]
        },
        {
          "propertyPath": "shipping",
          "propertyValue": [
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Lefferts Place"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Marenisco"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Maryland"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "44582"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "8427"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Lefferts Place"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Marenisco"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Maryland"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "44582"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "8427"
                    }
                  ]
                ]
              }
            ]
          ]
        },
        {
          "propertyPath": "billing",
          "propertyValue": [
            [
              {
                "propertyPath": "billing.street",
                "propertyValue": "Varick Avenue"
              },
              {
                "propertyPath": "billing.city",
                "propertyValue": "Mooresburg"
              },
              {
                "propertyPath": "billing.state",
                "propertyValue": "Delaware"
              },
              {
                "propertyPath": "billing.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "billing.zip.fiveDigit",
                      "propertyValue": "17654"
                    },
                    {
                      "propertyPath": "billing.zip.plusFour",
                      "propertyValue": "1292"
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ]
    },
    {
      "index": 3,
      "uri": "/Customer/Cust3.json",
      "primaryKey": {
        "propertyPath": "customerId",
        "propertyValue": 103
      },
      "path": "fn:doc(\"/Customer/Cust3.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust3.json",
      "mimetype": "application/json",
      "format": "json",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust3.json\")/object-node()",
          "match-text": [
            "Customer 0.0.1 http://example.org/ Adams Cole ad coley Verona Place Keyport Ohio 14391 1362 Verona Place2 Keyport2 Ohio 14391 1362 Ellery Street Fillmore Missouri 85554"
          ]
        }
      ],
      "entityProperties": [
        {
          "propertyPath": "customerId",
          "propertyValue": 103
        },
        {
          "propertyPath": "name",
          "propertyValue": "Adams Cole"
        },
        {
          "propertyPath": "nicknames",
          "propertyValue": [
            "ad",
            "coley"
          ]
        },
        {
          "propertyPath": "shipping",
          "propertyValue": [
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Verona Place"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Keyport"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Ohio"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "14391"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "1362"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Verona Place2"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Keyport2"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Ohio"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "14391"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "1362"
                    }
                  ]
                ]
              }
            ]
          ]
        },
        {
          "propertyPath": "billing",
          "propertyValue": [
            [
              {
                "propertyPath": "billing.street",
                "propertyValue": "Ellery Street"
              },
              {
                "propertyPath": "billing.city",
                "propertyValue": "Fillmore"
              },
              {
                "propertyPath": "billing.state",
                "propertyValue": "Missouri"
              },
              {
                "propertyPath": "billing.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "billing.zip.fiveDigit",
                      "propertyValue": "85554"
                    },
                    {
                      "propertyPath": "billing.zip.plusFour",
                      "propertyValue": "2762"
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ]
    },
    {
      "index": 4,
      "uri": "/Customer/Cust4.json",
      "primaryKey": {
        "propertyPath": "customerId",
        "propertyValue": 104
      },
      "path": "fn:doc(\"/Customer/Cust4.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust4.json",
      "mimetype": "application/json",
      "format": "json",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust4.json\")/object-node()",
          "match-text": [
            "Customer 0.0.1 http://example.org/ Powers Bauer power Thanos bau Willow Street Bedias Mississippi 94824 7938 Willow Street2 Bedias2 Mississippi 94824 7938 Bainbridge Street Retsof Vermont"
          ]
        }
      ],
      "entityProperties": [
        {
          "propertyPath": "customerId",
          "propertyValue": 104
        },
        {
          "propertyPath": "name",
          "propertyValue": "Powers Bauer"
        },
        {
          "propertyPath": "nicknames",
          "propertyValue": [
            "power",
            "Thanos",
            "bau"
          ]
        },
        {
          "propertyPath": "shipping",
          "propertyValue": [
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Willow Street"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Bedias"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Mississippi"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "94824"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "7938"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Willow Street2"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Bedias2"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Mississippi"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "94824"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "7938"
                    }
                  ]
                ]
              }
            ]
          ]
        },
        {
          "propertyPath": "billing",
          "propertyValue": [
            [
              {
                "propertyPath": "billing.street",
                "propertyValue": "Bainbridge Street"
              },
              {
                "propertyPath": "billing.city",
                "propertyValue": "Retsof"
              },
              {
                "propertyPath": "billing.state",
                "propertyValue": "Vermont"
              },
              {
                "propertyPath": "billing.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "billing.zip.fiveDigit",
                      "propertyValue": "38258"
                    },
                    {
                      "propertyPath": "billing.zip.plusFour",
                      "propertyValue": "4231"
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ]
    },
    {
      "index": 5,
      "uri": "/Customer/Cust5.json",
      "primaryKey": {
        "propertyPath": "customerId",
        "propertyValue": 105
      },
      "path": "fn:doc(\"/Customer/Cust5.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust5.json",
      "mimetype": "application/json",
      "format": "json",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust5.json\")/object-node()",
          "match-text": [
            "Customer 0.0.1 http://example.org/ Holland Wells holly well Hanover Place Marshall Oklahoma 19111 1001 Hanover Place2 Marshall2 Oklahoma 19111 1001 Sunnyside Avenue Brutus Wisconsin 30706"
          ]
        }
      ],
      "entityProperties": [
        {
          "propertyPath": "customerId",
          "propertyValue": 105
        },
        {
          "propertyPath": "name",
          "propertyValue": "Holland Wells"
        },
        {
          "propertyPath": "nicknames",
          "propertyValue": [
            "holly",
            "well"
          ]
        },
        {
          "propertyPath": "shipping",
          "propertyValue": [
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Hanover Place"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Marshall"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Oklahoma"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "19111"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "1001"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "propertyPath": "shipping.street",
                "propertyValue": "Hanover Place2"
              },
              {
                "propertyPath": "shipping.city",
                "propertyValue": "Marshall2"
              },
              {
                "propertyPath": "shipping.state",
                "propertyValue": "Oklahoma"
              },
              {
                "propertyPath": "shipping.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "shipping.zip.fiveDigit",
                      "propertyValue": "19111"
                    },
                    {
                      "propertyPath": "shipping.zip.plusFour",
                      "propertyValue": "1001"
                    }
                  ]
                ]
              }
            ]
          ]
        },
        {
          "propertyPath": "billing",
          "propertyValue": [
            [
              {
                "propertyPath": "billing.street",
                "propertyValue": "Sunnyside Avenue"
              },
              {
                "propertyPath": "billing.city",
                "propertyValue": "Brutus"
              },
              {
                "propertyPath": "billing.state",
                "propertyValue": "Wisconsin"
              },
              {
                "propertyPath": "billing.zip",
                "propertyValue": [
                  [
                    {
                      "propertyPath": "billing.zip.fiveDigit",
                      "propertyValue": "30706"
                    },
                    {
                      "propertyPath": "billing.zip.plusFour",
                      "propertyValue": "8854"
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ]
    },
    {
      "index": 6,
      "uri": "/Customer/Customer.pdf",
      "primaryKey": {
      },
      "path": "fn:doc(\"/Customer/Customer.pdf\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCustomer.pdf",
      "mimetype": "application/pdf",
      "format": "binary",
      "matches": [
        {
          "path": "fn:doc()",
          "match-text": [
          ]
        }
      ],
    },
    {
      "index": 7,
      "uri": "/Customer.xml",
      "primaryKey": {
      },
      "path": "fn:doc(\"/Customer/Cust1.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust7.json",
      "mimetype": "application/xml",
      "format": "xml",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust7.json\")/object-node()",
          "match-text": [
            "xml mathcing content"
          ]
        }
      ],
    },
    {
      "index": 8,
      "uri": "/Customer.txt",
      "primaryKey": {
      },
      "path": "fn:doc(\"/Customer/Cust8.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust8.json",
      "mimetype": "text/plain",
      "format": "text",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust8.json\")/object-node()",
          "match-text": [
            "text matching content"
          ]
        }
      ],
    },
  ],
  "facets": {
    "Collection": {
      "type": "collection",
      "facetValues": [
        {
          "name": "Customer",
          "count": 5,
          "value": "Customer"
        },
        {
          "name": "mapCustomerJson5078",
          "count": 5,
          "value": "mapCustomerJson5078"
        }
      ]
    },
    "createdByStep": {
      "type": "xs:string",
      "facetValues": [
        {
          "name": "entityservicesmapping",
          "count": 5,
          "value": "entityservicesmapping"
        }
      ]
    },
    "createdInFlowRange": {
      "type": "xs:string",
      "facetValues": [
        {
          "name": "CustomerFlow",
          "count": 5,
          "value": "CustomerFlow"
        }
      ]
    }
  },
  "metrics": {
    "query-resolution-time": "PT0.01017S",
    "facet-resolution-time": "PT0.006301S",
    "snippet-resolution-time": "PT0.002997S",
    "extract-resolution-time": "PT0.017997S",
    "total-time": "PT0.752398S"
  },
  "selectedPropertyDefinitions": [
    {
      "propertyPath": "customerId",
      "propertyLabel": "customerId",
      "datatype": "integer",
      "multiple": false
    },
    {
      "propertyPath": "name",
      "propertyLabel": "name",
      "datatype": "string",
      "multiple": false
    },
    {
      "propertyPath": "nicknames",
      "propertyLabel": "nicknames",
      "datatype": "string",
      "multiple": true
    },
    {
      "propertyPath": "shipping",
      "propertyLabel": "shipping",
      "datatype": "object",
      "multiple": true,
      "properties": [
        {
          "propertyPath": "shipping.street",
          "propertyLabel": "street",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "shipping.city",
          "propertyLabel": "city",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "shipping.state",
          "propertyLabel": "state",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "shipping.zip",
          "propertyLabel": "zip",
          "datatype": "object",
          "multiple": false,
          "properties": [
            {
              "propertyPath": "shipping.zip.fiveDigit",
              "propertyLabel": "fiveDigit",
              "datatype": "string",
              "multiple": false
            },
            {
              "propertyPath": "shipping.zip.plusFour",
              "propertyLabel": "plusFour",
              "datatype": "string",
              "multiple": false
            }
          ]
        }
      ]
    },
    {
      "propertyPath": "billing",
      "propertyLabel": "billing",
      "datatype": "object",
      "multiple": false,
      "properties": [
        {
          "propertyPath": "billing.street",
          "propertyLabel": "street",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "billing.city",
          "propertyLabel": "city",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "billing.state",
          "propertyLabel": "state",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "billing.zip",
          "propertyLabel": "zip",
          "datatype": "object",
          "multiple": false,
          "properties": [
            {
              "propertyPath": "billing.zip.fiveDigit",
              "propertyLabel": "fiveDigit",
              "datatype": "string",
              "multiple": false
            },
            {
              "propertyPath": "billing.zip.plusFour",
              "propertyLabel": "plusFour",
              "datatype": "string",
              "multiple": false
            }
          ]
        }
      ]
    }
  ],
  "entityPropertyDefinitions": [
    {
      "propertyPath": "customerId",
      "propertyLabel": "customerId",
      "datatype": "integer",
      "multiple": false
    },
    {
      "propertyPath": "name",
      "propertyLabel": "name",
      "datatype": "string",
      "multiple": false
    },
    {
      "propertyPath": "nicknames",
      "propertyLabel": "nicknames",
      "datatype": "string",
      "multiple": true
    },
    {
      "propertyPath": "shipping",
      "propertyLabel": "shipping",
      "datatype": "object",
      "multiple": true,
      "properties": [
        {
          "propertyPath": "shipping.street",
          "propertyLabel": "street",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "shipping.city",
          "propertyLabel": "city",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "shipping.state",
          "propertyLabel": "state",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "shipping.zip",
          "propertyLabel": "zip",
          "datatype": "object",
          "multiple": false,
          "properties": [
            {
              "propertyPath": "shipping.zip.fiveDigit",
              "propertyLabel": "fiveDigit",
              "datatype": "string",
              "multiple": false
            },
            {
              "propertyPath": "shipping.zip.plusFour",
              "propertyLabel": "plusFour",
              "datatype": "string",
              "multiple": false
            }
          ]
        }
      ]
    },
    {
      "propertyPath": "billing",
      "propertyLabel": "billing",
      "datatype": "object",
      "multiple": false,
      "properties": [
        {
          "propertyPath": "billing.street",
          "propertyLabel": "street",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "billing.city",
          "propertyLabel": "city",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "billing.state",
          "propertyLabel": "state",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "billing.zip",
          "propertyLabel": "zip",
          "datatype": "object",
          "multiple": false,
          "properties": [
            {
              "propertyPath": "billing.zip.fiveDigit",
              "propertyLabel": "fiveDigit",
              "datatype": "string",
              "multiple": false
            },
            {
              "propertyPath": "billing.zip.plusFour",
              "propertyLabel": "plusFour",
              "datatype": "string",
              "multiple": false
            }
          ]
        }
      ]
    },
    {
      "propertyPath": "customerSince",
      "propertyLabel": "customerSince",
      "datatype": "date",
      "multiple": false
    },
    {
      "propertyPath": "orders",
      "propertyLabel": "orders",
      "datatype": "object",
      "multiple": true,
      "properties": [
        {
          "propertyPath": "orders.orderId",
          "propertyLabel": "orderId",
          "datatype": "string",
          "multiple": false
        },
        {
          "propertyPath": "orders.address",
          "propertyLabel": "address",
          "datatype": "object",
          "multiple": false,
          "properties": [
            {
              "propertyPath": "orders.address.city",
              "propertyLabel": "city",
              "datatype": "string",
              "multiple": false
            },
            {
              "propertyPath": "orders.address.state",
              "propertyLabel": "state",
              "datatype": "string",
              "multiple": false
            }
          ]
        }
      ]
    }
  ]
};


export const  selectedPropertyDefinitions = [
  {
    "propertyPath": "customerId",
    "propertyLabel": "customerId",
    "datatype": "integer",
    "multiple": false
  },
  {
    "propertyPath": "name",
    "propertyLabel": "name",
    "datatype": "string",
    "multiple": false
  },
  {
    "propertyPath": "nicknames",
    "propertyLabel": "nicknames",
    "datatype": "string",
    "multiple": true
  },
  {
    "propertyPath": "shipping",
    "propertyLabel": "shipping",
    "datatype": "object",
    "multiple": true,
    "properties": [
      {
        "propertyPath": "shipping.street",
        "propertyLabel": "street",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "shipping.city",
        "propertyLabel": "city",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "shipping.state",
        "propertyLabel": "state",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "shipping.zip",
        "propertyLabel": "zip",
        "datatype": "object",
        "multiple": false,
        "properties": [
          {
            "propertyPath": "shipping.zip.fiveDigit",
            "propertyLabel": "fiveDigit",
            "datatype": "string",
            "multiple": false
          },
          {
            "propertyPath": "shipping.zip.plusFour",
            "propertyLabel": "plusFour",
            "datatype": "string",
            "multiple": false
          }
        ]
      }
    ]
  },
  {
    "propertyPath": "billing",
    "propertyLabel": "billing",
    "datatype": "object",
    "multiple": false,
    "properties": [
      {
        "propertyPath": "billing.street",
        "propertyLabel": "street",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "billing.city",
        "propertyLabel": "city",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "billing.state",
        "propertyLabel": "state",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "billing.zip",
        "propertyLabel": "zip",
        "datatype": "object",
        "multiple": false,
        "properties": [
          {
            "propertyPath": "billing.zip.fiveDigit",
            "propertyLabel": "fiveDigit",
            "datatype": "string",
            "multiple": false
          },
          {
            "propertyPath": "billing.zip.plusFour",
            "propertyLabel": "plusFour",
            "datatype": "string",
            "multiple": false
          }
        ]
      }
    ]
  }
];

export const entityPropertyDefinitions =  [
  {
    "propertyPath": "customerId",
    "propertyLabel": "customerId",
    "datatype": "integer",
    "multiple": false
  },
  {
    "propertyPath": "name",
    "propertyLabel": "name",
    "datatype": "string",
    "multiple": false
  },
  {
    "propertyPath": "nicknames",
    "propertyLabel": "nicknames",
    "datatype": "string",
    "multiple": true
  },
  {
    "propertyPath": "shipping",
    "propertyLabel": "shipping",
    "datatype": "object",
    "multiple": true,
    "properties": [
      {
        "propertyPath": "shipping.street",
        "propertyLabel": "street",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "shipping.city",
        "propertyLabel": "city",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "shipping.state",
        "propertyLabel": "state",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "shipping.zip",
        "propertyLabel": "zip",
        "datatype": "object",
        "multiple": false,
        "properties": [
          {
            "propertyPath": "shipping.zip.fiveDigit",
            "propertyLabel": "fiveDigit",
            "datatype": "string",
            "multiple": false
          },
          {
            "propertyPath": "shipping.zip.plusFour",
            "propertyLabel": "plusFour",
            "datatype": "string",
            "multiple": false
          }
        ]
      }
    ]
  },
  {
    "propertyPath": "billing",
    "propertyLabel": "billing",
    "datatype": "object",
    "multiple": false,
    "properties": [
      {
        "propertyPath": "billing.street",
        "propertyLabel": "street",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "billing.city",
        "propertyLabel": "city",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "billing.state",
        "propertyLabel": "state",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "billing.zip",
        "propertyLabel": "zip",
        "datatype": "object",
        "multiple": false,
        "properties": [
          {
            "propertyPath": "billing.zip.fiveDigit",
            "propertyLabel": "fiveDigit",
            "datatype": "string",
            "multiple": false
          },
          {
            "propertyPath": "billing.zip.plusFour",
            "propertyLabel": "plusFour",
            "datatype": "string",
            "multiple": false
          }
        ]
      }
    ]
  },
  {
    "propertyPath": "customerSince",
    "propertyLabel": "customerSince",
    "datatype": "date",
    "multiple": false
  },
  {
    "propertyPath": "orders",
    "propertyLabel": "orders",
    "datatype": "object",
    "multiple": true,
    "properties": [
      {
        "propertyPath": "orders.orderId",
        "propertyLabel": "orderId",
        "datatype": "string",
        "multiple": false
      },
      {
        "propertyPath": "orders.address",
        "propertyLabel": "address",
        "datatype": "object",
        "multiple": false,
        "properties": [
          {
            "propertyPath": "orders.address.city",
            "propertyLabel": "city",
            "datatype": "string",
            "multiple": false
          },
          {
            "propertyPath": "orders.address.state",
            "propertyLabel": "state",
            "datatype": "string",
            "multiple": false
          }
        ]
      }
    ]
  }
];

export const entitySearchAllEntities = {
  "snippet-format": "snippet",
  "total": 5,
  "start": 1,
  "page-length": 10,
  "selected": "include",
  "results": [
    {
      "index": 1,
      "identifier": {
        "propertyPath": "identifier",
        "propertyValue": 101
      },
      "primaryKey": {
        "propertyPath": "customerId",
        "propertyValue": 101
      },
      "uri": "/Customer/Cust1.json",
      "entityName": "Customer",
      "createdOn": "2020-06-21T23:44:46.225063-07:00",
      "path": "fn:doc(\"/Customer/Cust1.json\")",
      "score": 0,
      "confidence": 0,
      "fitness": 0,
      "href": "/v1/documents?uri=%2FCustomer%2FCust1.json",
      "mimetype": "application/json",
      "format": "json",
      "matches": [
        {
          "path": "fn:doc(\"/Customer/Cust1.json\")/object-node()",
          "match-text": [
            "Customer 0.0.1 http://example.org/ Carmella Hardin Carm din Whitwell Place Ellerslie Georgia 52239 1718 Whitwell Place2 Ellerslie2 Georgia 52239 1718 Anna Court Stewart Kansas 62601"
          ]
        }
      ]
    }]};


export const entityDefArray = [{
  info: {
    baseUri: "http://example.org/",
    title: "Customer",
    version: "0.0.1"
  },
  name: "Customer",
  pathIndex: [],
  primaryKey: "customerId",
  properties: [
    {
      collation: undefined,
      datatype: "integer",
      name: "customerId",
      ref: ""
    },
    {
      collation: "http://marklogic.com/collation/codepoint",
      datatype: "string",
      name: "name",
      ref: ""
    },
    {
      collation: undefined,
      datatype: "array",
      name: "nicknames",
      ref: ""
    },
    {
      collation: undefined,
      datatype: "array",
      name: "shipping",
      ref: "Address"
    },
    {
      collation: undefined,
      datatype: "entity",
      name: "billing",
      ref: "Address"
    },
    {
      collation: undefined,
      datatype: "date",
      name: "birthDate",
      ref: ""
    },
    {
      collation: undefined,
      datatype: "string",
      name: "status",
      ref: ""
    },
    {
      collation: undefined,
      datatype: "date",
      name: "customerSince",
      ref: ""
    },
    {
      collation: undefined,
      datatype: "array",
      name: "orders",
      ref: "Order"
    }],
  rangeIndex: []
}];




