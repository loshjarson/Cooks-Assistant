import { Divider, Paper } from "@mui/material";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

function Recipes() {
    return (
        <Paper elevation={12} style={{
            width: "80vw",
            height: "80vh",
            margin: "auto",
            transform: "translate(0,5%)",
            }}>
                <div className="recipe-search-bar" style={{display:"flex", flexDirection:"row", justifyContent:"space-around", padding:"10px 0"}}>
                    <Input addonBefore={<SearchOutlined />} style={{width:"20vw"}}/>
                    <Button icon={<FilterOutlined/>}/>
                </div>
                <Divider/>
                <div className="recipe-list"></div>
        </Paper>
    );
}

export default Recipes;