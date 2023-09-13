const Renderer_LinkButton = "renderer_link_button";
const Renderer_Icon_Button = "renderer_icon_button";
const Renderer_Select_Check_Box = "renderer_select_check_box";
const Render_Select = "renderer_select";
const Renderer_Image_Upload = "renderer_image_upload";
const Renderer_Lable_Input = "renderer_cell_editor";
const Renderer_Header_CheckBox = "renderer_Header_CheckBox";

export interface RENDERER_EVENT {
  type: string;
  value?: any;
  value1?: any;
  value2?: any;
  row?: number;
  col?: number;
  field?: string;
  pos?: string;
}

export default {
  Renderer_LinkButton,
  Renderer_Icon_Button,
  Renderer_Select_Check_Box,
  Render_Select,
  Renderer_Image_Upload,
  Renderer_Lable_Input,
  Renderer_Header_CheckBox,
};
