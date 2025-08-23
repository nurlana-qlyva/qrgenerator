"use client"

import { useState } from "react";
import { ChromePicker } from "react-color";

export default function ColorPickerExample() {
    const [color, setColor] = useState({
        r: 38,
        g: 34,
        b: 165,
        a: 1,
    });

    const [savedColors, setSavedColors] = useState([
        "#FF0000", "#FF7F00", "#FFD700", "#90EE90", "#FF69B4", "#8A2BE2", "#A52A2A",
        "#000080", "#8B0000", "#800080", "#228B22", "#20B2AA"
    ]);

    const handleChange = (newColor) => {
        setColor(newColor.rgb);
    };

    return (
        <div style={{ width: "100%", height: "240px" }} >
            <div style={{ width: "100%", height: "240px" }}>
                <ChromePicker
                    color={color}
                    onChange={handleChange}
                    presetColors={savedColors}
                    styles={{
                        default: {
                            picker: {
                                display: "flex",
                                flexDirection: "row",
                                boxShadow: "none",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                width: "100%",
                                height: "100%",   
                            },
                            saturation: {
                                width: "50%",
                                minWidth: "50%",
                                height: "100%",    
                                borderRadius: "4px",
                                position: "relative",
                                flex: "none",
                                padding: "0"
                            },
                            body: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                width: "50%",
                                height: "100%",  
                            },
                            controls: {
                                width: "100%",
                            },
                            hue: {
                                width: "100%",
                            },
                        }
                    }}
                />
            </div>

        </div>
    );
}
