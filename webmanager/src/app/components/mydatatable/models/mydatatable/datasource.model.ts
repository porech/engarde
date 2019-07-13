import { DataRowsModel } from "./datarow.model";

export interface DataSourceModel {
    
    "header":{
    
        "cells": {
            "position": number,
            "data": string
            
        }[]
    }
    ,
    "content": DataRowsModel,
    
    "keyItem": number,

    "tableOptions"?: {
        "dragdrop"?: {
            "isDraggable"?: boolean,
            "dragMode"?: "row" | "column" | "free"
        }
    }
    

}
