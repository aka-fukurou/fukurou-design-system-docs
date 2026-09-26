// use_figma — Notification Button / Examples (Buttons page, Light + Dark)
var page = figma.root.children.find(function (p) { return p.name === "Buttons"; });
await figma.setCurrentPageAsync(page);
var set = page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Notification Button"; });
var old = page.findOne(function (n) { return n.name === "Notification Button / Examples"; });
if (old) old.remove();
if (!set) return { error: "missing set" };
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
function boundPaint(variable) { function rc(v){var g=0;while(v&&g++<12){var mid=Object.keys(v.valuesByMode)[0];var val=v.valuesByMode[mid];if(val&&val.type==="VARIABLE_ALIAS")v=figma.variables.getVariableById(val.id);else return val;}return {r:0.96,g:0.96,b:0.95};} var c=rc(variable); return figma.variables.setBoundVariableForPaint({type:"SOLID",color:{r:c.r,g:c.g,b:c.b},opacity:1},"color",variable); }
function countKey(){return Object.keys(set.componentPropertyDefinitions).find(function(k){return k.indexOf("Count")===0;});}
var CK = countKey();
function variant(state, badge){ return set.children.find(function(c){ return c.name.indexOf("State="+state)>=0 && c.name.indexOf("Badge="+badge)>=0; }); }
function makeSection(name, modeId){ var s=figma.createFrame(); s.name=name; s.layoutMode="HORIZONTAL"; s.layoutWrap="WRAP"; s.primaryAxisSizingMode="FIXED"; s.counterAxisSizingMode="AUTO"; s.itemSpacing=28; s.counterAxisSpacing=28; s.paddingTop=28; s.paddingBottom=28; s.paddingLeft=28; s.paddingRight=28; s.fills=[boundPaint(pageBg)]; s.cornerRadius=12; s.setExplicitVariableModeForCollection(themeCol, modeId); s.clipsContent=false; return s; }
function addExample(parent, title, state, badge, count){ var row=figma.createFrame(); row.name=title; row.layoutMode="VERTICAL"; row.primaryAxisSizingMode="AUTO"; row.counterAxisSizingMode="AUTO"; row.itemSpacing=10; row.counterAxisAlignItems="CENTER"; row.fills=[]; row.clipsContent=false; parent.appendChild(row); var cap=figma.createText(); cap.fontName={family:"Poppins",style:"SemiBold"}; cap.characters=title; cap.fontSize=11; row.appendChild(cap); var inst=variant(state,badge).createInstance(); inst.name="Notification Button"; row.appendChild(inst); if(count&&CK){ var p={}; p[CK]=count; try{inst.setProperties(p);}catch(e){} } return inst; }
var frame=figma.createFrame(); frame.name="Notification Button / Examples"; frame.layoutMode="VERTICAL"; frame.primaryAxisSizingMode="AUTO"; frame.counterAxisSizingMode="AUTO"; frame.itemSpacing=28; frame.paddingTop=40; frame.paddingBottom=40; frame.paddingLeft=40; frame.paddingRight=40; frame.fills=[{type:"SOLID",color:{r:0.98,g:0.98,b:0.97}}]; frame.clipsContent=false; page.appendChild(frame); frame.x=4700; frame.y=820;
var title=figma.createText(); title.fontName={family:"Poppins",style:"SemiBold"}; title.characters="Notification Button / Examples"; title.fontSize=20; frame.appendChild(title);
var intro=figma.createText(); intro.fontName={family:"Poppins",style:"Regular"}; intro.characters="Specialized icon button for notification entry points (bell). Built on the Icon Button foundation — reuses its shape, size, states, focus ring, and color/icon-button/* tokens. Badge communicates unread/new activity: None, Dot, or Count (with 99+ handling)."; intro.fontSize=14; frame.appendChild(intro); intro.layoutSizingHorizontal="FILL";
var a11y=figma.createText(); a11y.fontName={family:"Poppins",style:"Regular"}; a11y.characters="Accessibility: give an accessible label in code (e.g. \u201CNotifications, 3 unread\u201D); the badge must not be the only signal of critical info; keep the focus ring visible; count text passes contrast (white on red/600)."; a11y.fontSize=12; frame.appendChild(a11y); a11y.layoutSizingHorizontal="FILL";
[["Light",lightId],["Dark",darkId]].forEach(function(m){ var sec=makeSection(m[0], m[1]); frame.appendChild(sec); sec.resize(560, 10); addExample(sec,"No badge","Default","None"); addExample(sec,"Dot","Default","Dot"); addExample(sec,"Count","Default","Count","3"); addExample(sec,"Count 99+","Default","Count","99+"); addExample(sec,"Focus","Focus","Dot"); addExample(sec,"Disabled","Disabled","Count","3"); });
return { id: frame.id };
