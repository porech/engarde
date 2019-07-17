export interface DataTableConfig {
            mobileHeaderColor?:string,
            tableWidth?: string,
            tableHeight?: string,
            tablePadding?: number,
            tableBackgroundColor?: string,
            tableBackground?: {
                doubleColor?: {
                    enabled: boolean,
                    primaryColor: string,
                    secondaryColor: string
                },
                color?: string
            },
            textColor?: string,
            dragdrop?: {
                isDraggable: boolean,
                dragMode: "row" | "column" | "free",
                backgroundColor?: string,
                textColor?: string
            },
            editMode?: boolean,
            tableId?: string

}
