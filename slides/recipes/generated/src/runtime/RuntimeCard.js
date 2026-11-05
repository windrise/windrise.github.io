// DataMagic MIT, native Vue VNode port. Edit corresponding ported source; run scripts/port-datamagic.mjs.
import React from '../../../runtime/vue-runtime.ts';
import { AbsoluteFill } from '../../../runtime/motion-runtime.ts';
import { EditableSceneContext } from '../legacy/components/scenes/EditableTransform.js';
import { RuntimeStyleTemplateScene, hasRuntimeStyleTemplateAdapter } from '../legacy/components/scenes/RuntimeStyleTemplateScene.js';
import { RuntimeTextTemplateScene, hasRuntimeTextTemplateAdapter } from '../legacy/components/scenes/RuntimeTextTemplateScene.js';
// Standalone data-bound render entry. Imported templates retain their original
// 1280x720 canvas; each composition supplies its own editable sample props.
export const RuntimeCard = ({ sceneContent, scene }) => {
    const id = sceneContent?.style_template_id;
    const text = hasRuntimeTextTemplateAdapter(id);
    if (!text && !hasRuntimeStyleTemplateAdapter(id))
        throw new Error(`Unknown Cards template: ${id}`);
    const Component = text ? RuntimeTextTemplateScene : RuntimeStyleTemplateScene;
    const renderScene = { ...scene, content: sceneContent };
    return React.createElement(EditableSceneContext.Provider, { value: { scene: renderScene, sceneContent } },
        React.createElement(AbsoluteFill, { style: { background: sceneContent?.style?.background_color || '#f8fafc' } },
            React.createElement(Component, { sceneContent: sceneContent, scene: renderScene })));
};
