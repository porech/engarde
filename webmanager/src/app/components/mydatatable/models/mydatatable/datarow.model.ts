export interface DataRowsModel {
        "rows": {
              "cells": {
                "position": number,
                "data": string,
                  "options"?: {
                      "isIcon": boolean,
                      "customClasses": string[],
                      "isHtml"?: boolean,
                      //per iniettare elementi personalizzati nelle celle
                      "customElements": [{
                            "name": string,
                            "content": string,
                            "style": string,
                            "class": string,
                            "bindings": [{
                                "key": string,
                                "value": string
                            }]
                        }],
                    "hidden"?: boolean,
                    "click"?: (input, callback) => any
                  }
        }[]
    }[]

}
