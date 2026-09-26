// use_figma — Snackbar / Examples (_Documentation page, Light + Dark)
var page = figma.root.children.find(function (p) { return p.name === "_Documentation"; });
await figma.setCurrentPageAsync(page);
var set = page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Snackbar"; });
var old = page.findOne(function (n) { return n.name === "Snackbar / Examples"; });
if (old) old.remove();
if (!set) return { error: "missing set" };
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
function boundPaint(variable) { function rc(v){var g=0;while(v&&g++<12){var mid=Object.keys(v.valuesByMode)[0];var val=v.valuesByMode[mid];if(val&&val.type==="VARIABLE_ALIAS")v=figma.variables.getVariableById(val.id);else return val;}return {r:0.96,g:0.96,b:0.95};} var c=rc(variable); return figma.variables.setBoundVariableForPaint({type:"SOLID",color:{r:c.r,g:c.g,b:c.b},opacity:1},"color",variable); }
function key(prefix){return Object.keys(set.componentPropertyDefinitions).find(function(k){return k.indexOf(prefix)===0;});}
var K={msg:key("Message"),action:key("Action"),showIcon:key("Show icon"),showAction:key("Show action"),showClose:key("Show close")};
function tone(t){ return set.children.find(function(c){ return c.name==="Tone="+t; }); }
function makeSection(name, modeId){ var s=figma.createFrame(); s.name=name; s.layoutMode="VERTICAL"; s.primaryAxisSizingMode="AUTO"; s.counterAxisSizingMode="FIXED"; s.itemSpacing=18; s.paddingTop=28; s.paddingBottom=28; s.paddingLeft=28; s.paddingRight=28; s.fills=[boundPaint(pageBg)]; s.cornerRadius=12; s.setExplicitVariableModeForCollection(themeCol, modeId); s.clipsContent=false; return s; }
function addExample(parent, title, t, props, fixedW){ var row=figma.createFrame(); row.name=title; row.layoutMode="VERTICAL"; row.primaryAxisSizingMode="AUTO"; row.counterAxisSizingMode="FIXED"; row.itemSpacing=8; row.fills=[]; row.clipsContent=false; parent.appendChild(row); row.layoutSizingHorizontal="FILL"; var cap=figma.createText(); cap.fontName={family:"Poppins",style:"SemiBold"}; cap.characters=title; cap.fontSize=11; row.appendChild(cap); cap.layoutSizingHorizontal="FILL"; var inst=tone(t).createInstance(); inst.name="Snackbar"; row.appendChild(inst); try{ inst.setProperties(props||{}); }catch(e){} if(fixedW){ inst.layoutSizingHorizontal="FIXED"; inst.resize(fixedW, inst.height); } row.primaryAxisSizingMode="AUTO"; return inst; }
var frame=figma.createFrame(); frame.name="Snackbar / Examples"; frame.layoutMode="VERTICAL"; frame.primaryAxisSizingMode="AUTO"; frame.counterAxisSizingMode="AUTO"; frame.itemSpacing=28; frame.paddingTop=40; frame.paddingBottom=40; frame.paddingLeft=40; frame.paddingRight=40; frame.fills=[{type:"SOLID",color:{r:0.98,g:0.98,b:0.97}}]; frame.clipsContent=false; page.appendChild(frame); frame.x=1380; frame.y=1600;
var title=figma.createText(); title.fontName={family:"Poppins",style:"SemiBold"}; title.characters="Snackbar / Examples"; title.fontSize=20; frame.appendChild(title);
var intro=figma.createText(); intro.fontName={family:"Poppins",style:"Regular"}; intro.characters="Short, temporary feedback after an action. Tones: Neutral, Success, Warning, Danger, Info. Optional leading icon, action, and close. Fixed dark container in both themes for strong readability; tone shown via colored icon + accent border; floating elevation."; intro.fontSize=14; frame.appendChild(intro); intro.layoutSizingHorizontal="FILL";
var a11y=figma.createText(); a11y.fontName={family:"Poppins",style:"Regular"}; a11y.characters="Accessibility: message/action/close pass contrast on the dark surface (both themes); tone is not conveyed by color alone (icon + text); action & close need visible focus in code; don\u2019t use Snackbar for persistent/critical alerts."; a11y.fontSize=12; frame.appendChild(a11y); a11y.layoutSizingHorizontal="FILL";
var msgs={Neutral:"Changes saved.",Success:"Payment method added.",Warning:"Your session will expire soon.",Danger:"Couldn\u2019t save changes.",Info:"New update available."};
[["Light",lightId],["Dark",darkId]].forEach(function(m){ var sec=makeSection(m[0], m[1]); frame.appendChild(sec); sec.resize(560, 10);
  ["Neutral","Success","Warning","Danger","Info"].forEach(function(t){ var p={}; p[K.msg]=msgs[t]; addExample(sec, t, t, p); });
  var pa={}; pa[K.msg]="Link copied."; pa[K.showIcon]=false; pa[K.showClose]=false; addExample(sec,"With action only", "Neutral", pa);
  var pc={}; pc[K.msg]="Message sent."; pc[K.showIcon]=false; pc[K.showAction]=false; addExample(sec,"With close only","Neutral", pc);
  var pi={}; pi[K.msg]="Saved to drafts."; pi[K.showAction]=false; pi[K.showClose]=false; addExample(sec,"With icon only","Success", pi);
  var pl={}; pl[K.msg]="We couldn\u2019t sync your latest changes because the connection dropped. We\u2019ll retry automatically in the background."; addExample(sec,"Long message wrapping","Danger", pl, 360);
});
return { id: frame.id };
