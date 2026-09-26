// use_figma — Tooltip + Modal Dialog Component examples (_Documentation page)
var page = figma.root.children.find(function (p) { return p.name === "_Documentation"; });
await figma.setCurrentPageAsync(page);
var tipSet = page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Tooltip"; });
var modalSet = page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Modal / Dialog"; });
var oldTip = page.findOne(function (n) { return n.name === "Tooltip Component"; });
var oldModal = page.findOne(function (n) { return n.name === "Modal Dialog Component"; });
if (oldTip) oldTip.remove(); if (oldModal) oldModal.remove();
if (!tipSet || !modalSet) return { error: "missing sets" };
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
var overlayTok = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/modal/overlay/background"; });
function boundPaint(v){function rc(x){var g=0;while(x&&g++<12){var mid=Object.keys(x.valuesByMode)[0];var val=x.valuesByMode[mid];if(val&&val.type==="VARIABLE_ALIAS")x=figma.variables.getVariableById(val.id);else return val;}return {r:0.96,g:0.96,b:0.95};}var c=rc(v);return figma.variables.setBoundVariableForPaint({type:"SOLID",color:{r:c.r,g:c.g,b:c.b},opacity:1},"color",v);}
function makeSection(name,modeId){var s=figma.createFrame();s.name=name;s.layoutMode="VERTICAL";s.primaryAxisSizingMode="AUTO";s.counterAxisSizingMode="AUTO";s.itemSpacing=20;s.paddingTop=28;s.paddingBottom=28;s.paddingLeft=28;s.paddingRight=28;s.fills=[boundPaint(pageBg)];s.cornerRadius=12;s.setExplicitVariableModeForCollection(themeCol,modeId);s.clipsContent=false;return s;}
function tipKey(prefix){return Object.keys(tipSet.componentPropertyDefinitions).find(function(k){return k.indexOf(prefix)===0;});}
var TK={text:tipKey("Tooltip text"),showArrow:tipKey("Show arrow")};
function modalKey(prefix){return Object.keys(modalSet.componentPropertyDefinitions).find(function(k){return k.indexOf(prefix)===0;});}
var MK={showClose:modalKey("Show close button"),showFooter:modalKey("Show footer"),showSecondary:modalKey("Show secondary action")};

// Tooltip frame
var tipFrame=figma.createFrame();tipFrame.name="Tooltip Component";tipFrame.layoutMode="VERTICAL";tipFrame.primaryAxisSizingMode="AUTO";tipFrame.counterAxisSizingMode="AUTO";tipFrame.itemSpacing=28;tipFrame.paddingTop=40;tipFrame.paddingBottom=40;tipFrame.paddingLeft=40;tipFrame.paddingRight=40;tipFrame.fills=[{type:"SOLID",color:{r:0.98,g:0.98,b:0.97}}];tipFrame.clipsContent=false;page.appendChild(tipFrame);tipFrame.x=1100;tipFrame.y=80;
var tTitle=figma.createText();tTitle.fontName={family:"Poppins",style:"SemiBold"};tTitle.characters="Tooltip Component";tTitle.fontSize=20;tipFrame.appendChild(tTitle);
var tIntro=figma.createText();tIntro.fontName={family:"Poppins",style:"Regular"};tIntro.characters="Short contextual help for icons and controls. Placement: Top, Right, Bottom, Left. Optional arrow. Inverse surface adapts to Light/Dark theme modes.";tIntro.fontSize=14;tipFrame.appendChild(tIntro);tIntro.layoutSizingHorizontal="FILL";
var tA11y=figma.createText();tA11y.fontName={family:"Poppins",style:"Regular"};tA11y.characters="Accessibility: keep copy short; do not hide critical information in tooltips; support keyboard and screen-reader disclosure patterns in code; ensure trigger has visible focus.";tA11y.fontSize=12;tipFrame.appendChild(tA11y);tA11y.layoutSizingHorizontal="FILL";
[["Light",lightId],["Dark",darkId]].forEach(function(m){var sec=makeSection(m[0],m[1]);tipFrame.appendChild(sec);
  ["Top","Right","Bottom","Left"].forEach(function(pl){var row=figma.createFrame();row.name=pl;row.layoutMode="VERTICAL";row.itemSpacing=8;row.fills=[];sec.appendChild(row);
    var cap=figma.createText();cap.fontName={family:"Poppins",style:"SemiBold"};cap.characters=pl;cap.fontSize=11;row.appendChild(cap);
    var inst=tipSet.children.find(function(c){return c.name==="Placement="+pl;}).createInstance();row.appendChild(inst);});
  var noArr=tipSet.children.find(function(c){return c.name==="Placement=Top";}).createInstance();noArr.name="Without arrow";var p={};p[TK.showArrow]=false;try{noArr.setProperties(p);}catch(e){}
  var row2=figma.createFrame();row2.name="Without arrow";row2.layoutMode="VERTICAL";row2.itemSpacing=8;row2.fills=[];sec.appendChild(row2);var cap2=figma.createText();cap2.fontName={family:"Poppins",style:"SemiBold"};cap2.characters="Without arrow";cap2.fontSize=11;row2.appendChild(cap2);row2.appendChild(noArr);
});

// Modal frame
var modalFrame=figma.createFrame();modalFrame.name="Modal Dialog Component";modalFrame.layoutMode="VERTICAL";modalFrame.primaryAxisSizingMode="AUTO";modalFrame.counterAxisSizingMode="AUTO";modalFrame.itemSpacing=28;modalFrame.paddingTop=40;modalFrame.paddingBottom=40;modalFrame.paddingLeft=40;modalFrame.paddingRight=40;modalFrame.fills=[{type:"SOLID",color:{r:0.98,g:0.98,b:0.97}}];modalFrame.clipsContent=false;page.appendChild(modalFrame);modalFrame.x=1100;modalFrame.y=1200;
var mTitle=figma.createText();mTitle.fontName={family:"Poppins",style:"SemiBold"};mTitle.characters="Modal / Dialog Component";mTitle.fontSize=20;modalFrame.appendChild(mTitle);
var mIntro=figma.createText();mIntro.fontName={family:"Poppins",style:"Regular"};mIntro.characters="Focused blocking tasks: default, confirmation, and danger confirmation. Sizes S/M/L. Reuses Button + Icon Button. Overlay/scrim example uses color/modal/overlay/background at reduced opacity.";mIntro.fontSize=14;modalFrame.appendChild(mIntro);mIntro.layoutSizingHorizontal="FILL";
var mA11y=figma.createText();mA11y.fontName={family:"Poppins",style:"Regular"};mA11y.characters="Accessibility: trap focus in code; provide an accessible title; Escape closes when appropriate; close button needs a label; background inert while open; document initial focus behavior.";mA11y.fontSize=12;modalFrame.appendChild(mA11y);mA11y.layoutSizingHorizontal="FILL";
function overlayExample(parent,label,variantName){var wrap=figma.createFrame();wrap.name=label;wrap.layoutMode="VERTICAL";wrap.itemSpacing=8;wrap.fills=[];wrap.clipsContent=false;parent.appendChild(wrap);
  var cap=figma.createText();cap.fontName={family:"Poppins",style:"SemiBold"};cap.characters=label;cap.fontSize=11;wrap.appendChild(cap);
  var scene=figma.createFrame();scene.name="overlay-scene";scene.resize(520,320);scene.clipsContent=true;scene.cornerRadius=8;wrap.appendChild(scene);
  scene.fills=[boundPaint(pageBg)];scene.layoutMode="NONE";
  var scrim=figma.createRectangle();scrim.name="overlay";scrim.resize(520,320);scrim.fills=[boundPaint(overlayTok)];scrim.opacity=0.48;scene.appendChild(scrim);scrim.x=0;scrim.y=0;
  var inst=modalSet.children.find(function(c){return c.name===variantName;}).createInstance();scene.appendChild(inst);inst.x=20;inst.y=40;
  return wrap;
}
[["Light",lightId],["Dark",darkId]].forEach(function(m){var sec=makeSection(m[0],m[1]);modalFrame.appendChild(sec);
  overlayExample(sec,"Default · Medium","Type=Default, Size=Medium");
  overlayExample(sec,"Confirmation · Medium","Type=Confirmation, Size=Medium");
  overlayExample(sec,"Danger confirmation · Medium","Type=Danger confirmation, Size=Medium");
  overlayExample(sec,"Small","Type=Default, Size=Small");
  overlayExample(sec,"Large","Type=Default, Size=Large");
  var noFooter=modalSet.children.find(function(c){return c.name==="Type=Default, Size=Medium";}).createInstance();var p1={};p1[MK.showFooter]=false;try{noFooter.setProperties(p1);}catch(e){}
  overlayExample(sec,"Without footer","Type=Default, Size=Medium");
  var noClose=modalSet.children.find(function(c){return c.name==="Type=Confirmation, Size=Medium";}).createInstance();var p2={};p2[MK.showClose]=false;try{noClose.setProperties(p2);}catch(e){}
  var row=figma.createFrame();row.name="Without close button";row.layoutMode="VERTICAL";row.itemSpacing=8;row.fills=[];sec.appendChild(row);
  var cap=figma.createText();cap.fontName={family:"Poppins",style:"SemiBold"};cap.characters="Without close button";cap.fontSize=11;row.appendChild(cap);row.appendChild(noClose);
});
return { tipFrameId: tipFrame.id, modalFrameId: modalFrame.id };
