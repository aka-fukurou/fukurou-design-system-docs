// use_figma — Toggle Switch Examples (Form page)
var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var set = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Toggle / Switch"; });
var old = formPage.findOne(function (n) { return n.name === "Toggle Switch Examples"; });
if (old) old.remove();
if (!set) return { error: "missing set" };
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
function boundPaint(v){function rc(x){var g=0;while(x&&g++<12){var mid=Object.keys(x.valuesByMode)[0];var val=x.valuesByMode[mid];if(val&&val.type==="VARIABLE_ALIAS")x=figma.variables.getVariableById(val.id);else return val;}return {r:0.96,g:0.96,b:0.95};}var c=rc(v);return figma.variables.setBoundVariableForPaint({type:"SOLID",color:{r:c.r,g:c.g,b:c.b},opacity:1},"color",v);}
function findV(state, checked){return set.children.find(function(c){return c.name.indexOf("State="+state)>=0&&c.name.indexOf("Checked="+checked)>=0;});}
function propKey(prefix){return Object.keys(set.componentPropertyDefinitions).find(function(k){return k.indexOf(prefix)===0;});}
var K={showDesc:propKey("Show description")};
function makeSection(name,modeId){var s=figma.createFrame();s.name=name;s.layoutMode="VERTICAL";s.primaryAxisSizingMode="AUTO";s.counterAxisSizingMode="FIXED";s.itemSpacing=16;s.paddingTop=24;s.paddingBottom=24;s.paddingLeft=24;s.paddingRight=24;s.fills=[boundPaint(pageBg)];s.cornerRadius=12;s.setExplicitVariableModeForCollection(themeCol,modeId);return s;}
function addEx(parent,title,state,checked,props){var row=figma.createFrame();row.name=title;row.layoutMode="VERTICAL";row.itemSpacing=8;row.fills=[];parent.appendChild(row);var cap=figma.createText();cap.fontName={family:"Poppins",style:"SemiBold"};cap.characters=title;cap.fontSize=11;row.appendChild(cap);var inst=findV(state,checked).createInstance();row.appendChild(inst);try{if(props)inst.setProperties(props);}catch(e){}return inst;}
var frame=figma.createFrame();frame.name="Toggle Switch Examples";frame.layoutMode="VERTICAL";frame.primaryAxisSizingMode="AUTO";frame.counterAxisSizingMode="AUTO";frame.itemSpacing=28;frame.paddingTop=40;frame.paddingBottom=40;frame.paddingLeft=40;frame.paddingRight=40;frame.fills=[{type:"SOLID",color:{r:0.98,g:0.98,b:0.97}}];formPage.appendChild(frame);frame.x=10500;frame.y=450;
var title=figma.createText();title.fontName={family:"Poppins",style:"SemiBold"};title.characters="Toggle / Switch Examples";title.fontSize=20;frame.appendChild(title);
var intro=figma.createText();intro.fontName={family:"Poppins",style:"Regular"};intro.characters="Binary on/off control for settings and preferences. On state uses primary brand track color; off uses neutral track. Focus ring: 2px brand red + 2px gap, not clipped.";intro.fontSize=14;frame.appendChild(intro);intro.layoutSizingHorizontal="FILL";
var a11y=figma.createText();a11y.fontName={family:"Poppins",style:"Regular"};a11y.characters="Accessibility: always pair with a visible label; state must not rely on color alone (thumb position + label); use native switch/checkbox semantics in code; focus must be clearly visible.";a11y.fontSize=12;frame.appendChild(a11y);a11y.layoutSizingHorizontal="FILL";
[["Light",lightId],["Dark",darkId]].forEach(function(m){var sec=makeSection(m[0],m[1]);frame.appendChild(sec);sec.resize(420,10);
  addEx(sec,"Off · Default","Default","False");
  addEx(sec,"On · Default","Default","True");
  addEx(sec,"Off · Hover","Hover","False");
  addEx(sec,"On · Hover","Hover","True");
  addEx(sec,"Off · Focus","Focus","False");
  addEx(sec,"On · Focus","Focus","True");
  addEx(sec,"Disabled · Off","Disabled","False");
  addEx(sec,"Disabled · On","Disabled","True");
  var p={};p[K.showDesc]=false;addEx(sec,"Without description","Default","False",p);
});
return { id: frame.id };
