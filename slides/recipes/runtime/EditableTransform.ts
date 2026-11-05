import React,{createContext,useContext} from './vue-runtime';
export const EditableSceneContext=createContext<any>({});
/** Preserve stored geometry. Editing is via recipe parameters, not the upstream pointer editor. */
export function EditableTransform({id,role='group',children,style={},className,initial={},noPositionContext=false}:any) {
 const ctx=useContext(EditableSceneContext);
 const saved=ctx.sceneContent?.layout_overrides?.[id]?.transform??ctx.scene?.content?.layout_overrides?.[id]?.transform??{};
 const number=(key:string,fallback:number)=>typeof saved[key]==='number'?saved[key]:typeof initial[key]==='number'?initial[key]:fallback;
 const {transform,...rest}=style;
 return React.createElement('div',{'data-dm-editable-id':id,'data-dm-role':role,className,style:{position:noPositionContext?'static':'relative',display:'inline-block',...rest,transform:`${transform?transform+' ':''}translate(${number('x',0)}px, ${number('y',0)}px) scale(${number('scale',1)}) rotate(${number('rotation',0)}deg)`,transformOrigin:'center center'}},children);
}
export default EditableTransform;
