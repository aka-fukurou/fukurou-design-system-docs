// use_figma — Alert Banner Component examples (Notifications page)
var page = figma.root.children.find(function (p) { return p.name === "Notifications"; });
await figma.setCurrentPageAsync(page);
var set = page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Alert / Banner"; });
var old = page.findOne(function (n) { return n.name === "Alert Banner Component"; });
if (old) old.remove();
if (!set) return { error: "missing set" };
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
function boundPaint(v){function rc(x){var g=0;while(x&&g++<12){var mid=Object.keys(x.valuesByMode)[0];var val=x.valuesByMode[mid];if(val&&val.type==="VARIABLE_ALIAS")x=figma.variables.getVariableById(val.id);else return val;}return {r:0.96,g:0.96,b:0.95};}var c=rc(v);return figma.variables.setBoundVariableForPaint({type:"SOLID",color:{r:c.r,g:c.g,b:c.b},opacity:1},"color",v);}
function key(prefix){return Object.keys(set.componentPropertyDefinitions).find(function(k){return k.indexOf(prefix)===0;});}
var K={title:key("Title"),msg:key("Message"),action:key("Action"),showIcon:key("Show icon"),showTitle:key("Show title"),showAction:key("Show action"),showClose:key("Show close")};
function tone(t){return set.children.find(function(c){return c.name==="Tone="+t;});}
function makeSection(name,modeId){var s=figma.createFrame();s.name=name;s.layoutMode="VERTICAL";s.primaryAxisSizingMode="AUTO";s.counterAxisSizingMode="FIXED";s.itemSpacing=18;s.paddingTop=28;s.paddingBottom=28;s.paddingLeft=28;s.paddingRight=28;s.fills=[boundPaint(pageBg)];s.cornerRadius=12;s.setExplicitVariableModeForCollection(themeCol,modeId);s.clipsContent=false;return s;}
function addEx(parent,title,t,props,fixedW){var row=figma.createFrame();row.name=title;row.layoutMode="VERTICAL";row.primaryAxisSizingMode="AUTO";row.counterAxisSizingMode="FIXED";row.itemSpacing=8;row.fills=[];row.clipsContent=false;parent.appendChild(row);row.layoutSizingHorizontal="FILL";var cap=figma.createText();cap.fontName={family:"Poppins",style:"SemiBold"};cap.characters=title;cap.fontSize=11;row.appendChild(cap);cap.layoutSizingHorizontal="FILL";var inst=tone(t).createInstance();inst.name="Alert / Banner";row.appendChild(inst);try{inst.setProperties(props||{});}catch(e){}if(fixedW){inst.layoutSizingHorizontal="FIXED";inst.resize(fixedW,inst.height);}row.primaryAxisSizingMode="AUTO";return inst;}
var frame=figma.createFrame();frame.name="Alert Banner Component";frame.layoutMode="VERTICAL";frame.primaryAxisSizingMode="AUTO";frame.counterAxisSizingMode="AUTO";frame.itemSpacing=28;frame.paddingTop=40;frame.paddingBottom=40;frame.paddingLeft=40;frame.paddingRight=40;frame.fills=[{type:"SOLID",color:{r:0.98,g:0.98,b:0.97}}];frame.clipsContent=false;page.appendChild(frame);frame.x=2400;frame.y=400;
var title=figma.createText();title.fontName={family:"Poppins",style:"SemiBold"};title.characters="Alert / Banner Component";title.fontSize=20;frame.appendChild(title);
var intro=figma.createText();intro.fontName={family:"Poppins",style:"Regular"};intro.characters="Persistent system messages (not temporary like Snackbar). Tones: Neutral, Info, Success, Warning, Danger. Optional icon, title, action link, and dismiss. Subtle tone backgrounds with readable borders and text.";intro.fontSize=14;frame.appendChild(intro);intro.layoutSizingHorizontal="FILL";
var a11y=figma.createText();a11y.fontName={family:"Poppins",style:"Regular"};a11y.characters="Accessibility: convey meaning with text and icons (not color alone); warning/danger include clear icons; dismiss needs an accessible label; use role=alert for critical messages in code.";a11y.fontSize=12;frame.appendChild(a11y);a11y.layoutSizingHorizontal="FILL";
[["Light",lightId],["Dark",darkId]].forEach(function(m){var sec=makeSection(m[0],m[1]);frame.appendChild(sec);sec.resize(640,10);
  ["Neutral","Info","Success","Warning","Danger"].forEach(function(t){addEx(sec,t,t,{});});
  var p1={};p1[K.showTitle]=false;addEx(sec,"Message only","Info",p1);
  var p2={};p2[K.showAction]=true;p2[K.showClose]=false;addEx(sec,"With action","Neutral",p2);
  var p3={};p3[K.showIcon]=false;p3[K.showAction]=false;addEx(sec,"With close","Warning",p3);
  var p4={};p4[K.msg]="Your subscription renews in 3 days. Update billing details to avoid interruption.";addEx(sec,"Long message","Neutral",p4,520);
});
return { id: frame.id };
