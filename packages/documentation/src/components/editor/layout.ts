export const InitialLayout=  {
    "dockbox": {
        "id": "+17",
        "size": 200,
        "mode": "horizontal",
        "children": [
            {
                "id": "graphs",
                "size": 1694,
                "tabs": [
                    {
                        "id": "graph1",
                        "closable": false
                    }
                ],
                "group": "graph",
                "activeId": "graph1"
            },
            {
                "id": "+22",
                "size": 386,
                "mode": "vertical",
                "children": [
                    {
                        "id": "+23",
                        "size": 300,
                        "tabs": [
                            {
                                "id": "input",
                                "closable": false
                            },
                        ],

                        "group": "popout",
                        "activeId": "nodeSettings"
                    },
                    {
                        "id": "+24",
                        "size": 300,
                        "tabs": [
                            {
                                "id": "outputs",
                                "closable": false
                            }
                        ],
                        "group": "popout",
                        "activeId": "outputs"
                    }
                ]
            }
        ]
    },
    "floatbox": {
        "id": "+28",
        "size": 1,
        "mode": "float",
        "children": [
        ]
    },
    "windowbox": {
        "id": "+29",
        "size": 1,
        "mode": "window",
        "children": []
    },
    "maxbox": {
        "id": "+30",
        "size": 1,
        "mode": "maximize",
        "children": []
    }
}