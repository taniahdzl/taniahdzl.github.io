/* ============================================
   TANIA'S PORTFOLIO — huerto-garden.js
   Portal: Plant card → Top-down Garden
   ============================================ */

(function () {

  var PAL = {
    grass1:'#7ab84a',path:'#d4b896',pathDark:'#b89060',
    soil:'#a0643a',soilDark:'#7a4820',soilMid:'#8a5428',
    cream:'#FAF7F2',bg:'#F2EDE6',
    green:'#2A6B3F',greenL:'#5BAD72',
    red:'#D14B35',gold:'#C49A3C',blue:'#2B4C8C',
    ink:'#1A1A1A',inkL:'#555',woodDk:'#7a5828',wood:'#a07840',
  };

  var CW=680,CH=460,WW=1200,WH=980;

  var BEDS=[
    {x:80, y:80,  w:148,h:108},{x:278,y:80,  w:148,h:108},{x:476,y:80,  w:148,h:108},
    {x:674,y:80,  w:148,h:108},{x:872,y:80,  w:148,h:108},
    {x:80, y:240, w:148,h:108},{x:278,y:240, w:148,h:108},{x:476,y:240, w:148,h:108},
    {x:674,y:240, w:148,h:108},{x:872,y:240, w:148,h:108},
    {x:80, y:400, w:340,h:108},{x:470,y:400, w:550,h:108},
    {x:80, y:560, w:940,h:108},
  ];

  var PLANTS=[
    {bed:0,ox:.5,oy:.5,emoji:'🌽',name:'Milpa',stat:'Maíz · frijol · calabaza · 7,000 años',
     facts:[{tab:'Planta',text:'Sistema agrícola más antiguo de Mesoamérica. Las Tres Hermanas: maíz da soporte al frijol, frijol fija nitrógeno, calabaza cubre el suelo.'},{tab:'Huerto',text:'Corazón del Huerto ITAM. Cero fertilizantes sintéticos. Semillas criollas donadas por comunidades de Oaxaca y Puebla.',fun:'La milpa ITAM produce ~80kg de alimento/temporada con insumos 100% orgánicos.'},{tab:'Fun fact',text:'México tiene más de 64 razas nativas de maíz — la mayor diversidad genética del cereal en el mundo.',fun:'El maíz tardó 9,000 años en evolucionar del teosinte silvestre a la mazorca actual.'}],
     r:22,c:'#d4a020',bg:'#8a6010'},
    {bed:1,ox:.5,oy:.5,emoji:'🌺',name:'Dalia',stat:'Dahlia pinnata · flor nacional de México',
     facts:[{tab:'Planta',text:'Flor nacional de México. Originaria de los bosques de pino-encino del centro del país. Cultivada por los aztecas como alimento y ornamental.'},{tab:'Huerto',text:'Atrae el abejorro Bombus ephippiatus, endémico de México. +40% biodiversidad de polinizadores desde 2023.',fun:'La dalia puede florecer de marzo a diciembre en el clima de CDMX.'},{tab:'Fun fact',text:'Los tubérculos de la dalia eran comidos por los mexicas — saben a mezcla de papa y zanahoria.',fun:'Hay más de 57,000 variedades de dalia registradas en el mundo.'}],
     r:18,c:'#e04080',bg:'#901040'},
    {bed:2,ox:.5,oy:.5,emoji:'🌶️',name:'Chiles nativos',stat:'8 variedades · 2 en riesgo de extinción',
     facts:[{tab:'Planta',text:'México es el centro de origen del género Capsicum. ~64 especies nativas, muchas endémicas. El chile pasilla mixe está en riesgo de extinción.'},{tab:'Huerto',text:'Preservamos chile de agua oaxaqueño y serrano. Proyecto de rescate con comunidades de la Sierra Juárez.',fun:'Dos de nuestras variedades solo se consiguen en mercados locales de Oaxaca.'},{tab:'Fun fact',text:'La capsaicina es defensa contra mamíferos pero no afecta aves — que dispersan las semillas. Evolución brillante.',fun:'México consume 14kg de chile por persona al año — el mayor consumo del mundo.'}],
     r:17,c:'#D14B35',bg:'#8a2010'},
    {bed:3,ox:.5,oy:.5,emoji:'🥑',name:'Aguacate criollo',stat:'Persea drymifolia · Sierra Madre del Sur',
     facts:[{tab:'Planta',text:'El aguacate criollo dio origen a todas las variedades comerciales. Más pequeño y aromático que el Hass. Sus hojas secas son especia en barbacoa.'},{tab:'Huerto',text:'Nuestro árbol tiene 6 años. Produce frutos para talleres gastronómicos.',fun:'Un aguacate tarda entre 5 y 13 años en dar su primera fruta desde semilla.'},{tab:'Fun fact',text:'El aguacate coevolucionó con mastodontes que comían su fruto entero. Sin esos animales extintos, habría desaparecido.',fun:'México produce el 30% del aguacate mundial.'}],
     r:20,c:'#3a8020',bg:'#1a5008'},
    {bed:4,ox:.5,oy:.5,emoji:'🍅',name:'Jitomate heirloom',stat:'Solanum lycopersicum · 6 variedades',
     facts:[{tab:'Planta',text:'"Xitomatl" en náhuatl. México es centro de diversidad genética con decenas de variedades silvestres únicas.'},{tab:'Huerto',text:'Cultivamos 6 variedades heirloom: corazón de buey, negro ruso, verde tomatillo. Abastecen el comedor universitario.',fun:'Nuestros jitomates viajan exactamente 200 metros del huerto al comedor.'},{tab:'Fun fact',text:'Cuando llegó a Europa en el s. XVI, los italianos pensaron que era venenoso durante 200 años.',fun:'El jitomate es técnicamente una fruta.'}],
     r:17,c:'#D14B35',bg:'#7a2008'},
    {bed:5,ox:.5,oy:.5,emoji:'🌵',name:'Nopal',stat:'Opuntia sp. · símbolo nacional',
     facts:[{tab:'Planta',text:'Símbolo nacional — aparece en la bandera. Metabolismo CAM: fija CO₂ de noche. Sobrevive hasta 2 años sin lluvia.'},{tab:'Huerto',text:'Pencas cosechadas para el comedor. La cochinilla que lo habita se usa en proyectos de colorantes naturales.',fun:'Un nopal adulto absorbe hasta 400g de CO₂ al día — más que un árbol joven.'},{tab:'Fun fact',text:'La grana cochinilla del nopal fue más valiosa que el oro en el s. XVI. Está en el Frappuccino de Starbucks.',fun:'Hay cochinilla (E120) en muchos productos "naturales" del super.'}],
     r:20,c:'#5BAD72',bg:'#2A6B3F'},
    {bed:6,ox:.5,oy:.5,emoji:'🍋',name:'Cítricos',stat:'Limón mexicano · naranjo · mandarina',
     facts:[{tab:'Planta',text:'El limón mexicano llegó de Asia en el s. XVI pero México es hoy el mayor productor mundial.'},{tab:'Huerto',text:'Tres árboles perennes. Frutos para talleres de gastronomía sostenible y bebidas del comedor.',fun:'Nuestro limonero tiene 8 años y produce ~4kg de limones por temporada.'},{tab:'Fun fact',text:'El limón verde ácido que usamos en México no existe en Europa — ellos llaman "lima" a lo que nosotros llamamos "limón".',fun:'México es el principal exportador de limón del mundo.'}],
     r:18,c:'#C49A3C',bg:'#806010'},
    {bed:7,ox:.5,oy:.5,emoji:'🥬',name:'Verduras de hoja',stat:'Cosecha continua · comedor ITAM',
     facts:[{tab:'Planta',text:'Lechuga, espinaca y acelga. Cultivos de temporada fresca, rotación cada 6 semanas para cosecha continua.'},{tab:'Huerto',text:'Abastecemos ensaladas del comedor universitario cada semana del ciclo escolar.',fun:'Reducimos ~15kg de plástico de empaque al año al no comprar verdura empacada.'},{tab:'Fun fact',text:'La espinaca tiene oxalato de calcio que reduce la absorción del hierro en un 90%. Popeye tenía un error científico.',fun:'La lechuga es 95% agua pero aporta vitamina K, fundamental para la coagulación.'}],
     r:17,c:'#5BAD72',bg:'#187018'},
    {bed:8,ox:.5,oy:.5,emoji:'🌿',name:'Hierbas medicinales',stat:'Epazote · hierba santa · ruda · 12 especies',
     facts:[{tab:'Planta',text:'El epazote (Dysphania ambrosioides) se usa en México hace 3,000 años. La hierba santa tiene hojas del tamaño de una hoja carta y huele a anís negro.'},{tab:'Huerto',text:'Los estudiantes cortan libremente para cocinar. Talleres de medicina tradicional cada semestre.',fun:'El epazote en los frijoles reduce los gases — efectivo al 100% según estudios del IPN.'},{tab:'Fun fact',text:'México tiene más de 4,000 plantas medicinales — segunda mayor diversidad del mundo después de China.',fun:'Los mayas usaban la hierba santa para envolver tamales ceremoniales hace 2,000 años.'}],
     r:16,c:'#2A6B3F',bg:'#1a4428'},
    {bed:9,ox:.5,oy:.5,emoji:'🌻',name:'Polinizadores',stat:'Girasol nativo · +40% biodiversidad',
     facts:[{tab:'Planta',text:'El girasol (Helianthus annuus) es originario de Norteamérica. Los aztecas lo cultivaban como alimento, aceite y pigmento ceremonial.'},{tab:'Huerto',text:'Parcela de flores nativas para abejas y mariposas. La monarca pasa por el campus en migración anual.',fun:'Cada abeja de nuestra parcela poliniza en promedio 3 plantas más del huerto.'},{tab:'Fun fact',text:'El "girasol" es en realidad miles de flores diminutas. Cada "semilla" es el fruto de una flor individual.',fun:'Un girasol puede contener hasta 2,000 semillas individuales.'}],
     r:19,c:'#C49A3C',bg:'#806808'},
    {bed:10,ox:.28,oy:.5,emoji:'♻️',name:'Compostera',stat:'~200kg compost/año · ciclo cerrado',
     facts:[{tab:'Sistema',text:'Tres etapas: trituración, fermentación activa (55–65°C) y maduración. Residuos del comedor → composta en 12–16 semanas.'},{tab:'Huerto',text:'Genera ~200kg/año. Cubre el 80% de la fertilización. El resto se dona a huertos comunitarios de Guadalupe Inn.',fun:'Cada kg de composta evita 2.5kg de CO₂ vs. fertilizante sintético.'},{tab:'Fun fact',text:'Los microorganismos en una pila activa generan tanto calor que pasteurizan patógenos — temperatura interna supera los 60°C.',fun:'Viven más de 1 millón de microorganismos por gramo de composta activa.'}],
     r:20,c:'#a07040',bg:'#603010'},
    {bed:11,ox:.72,oy:.5,emoji:'🌸',name:'Bugambilia',stat:'Bougainvillea glabra · costa del Pacífico MX',
     facts:[{tab:'Planta',text:'Originaria de la costa del Pacífico mexicano. Lo que parecen flores de colores son brácteas (hojas modificadas). Sus flores reales son blancas y diminutas.'},{tab:'Huerto',text:'Usamos como cerca viva en el perímetro. Atrae mariposas monarca en su migración anual.',fun:'La bugambilia florece hasta 11 meses al año en el clima de CDMX.'},{tab:'Fun fact',text:'El nombre viene de Bougainville, primer francés en dar la vuelta al mundo. Su centro de diversidad es México.',fun:'18 de las 22 especies de Bougainvillea del mundo se encuentran en México.'}],
     r:16,c:'#D14B35',bg:'#801030'},
    {bed:12,ox:.5,oy:.5,emoji:'🌱',name:'Bancales comunitarios',stat:'200+ estudiantes/año · jardín vivo',
     facts:[{tab:'Planta',text:'Parcelas asignadas a proyectos estudiantiles. Cada ciclo nuevos equipos cultivan, experimentan y aprenden en contexto real.'},{tab:'Huerto',text:'El jardín es un laboratorio vivo donde los estudiantes aplican biología, economía y diseño.',fun:'Más de 200 estudiantes pasan por el huerto cada ciclo escolar.'},{tab:'Fun fact',text:'Huertos universitarios reducen el estrés académico — 20 min de jardinería reduce cortisol tanto como el ejercicio físico.',fun:'El Huerto ITAM es el único huerto universitario autosustentable de la CDMX.'}],
     r:15,c:'#5BAD72',bg:'#287020'},
  ];

  function buildDecor(){
    var d=[],s=42;
    function rng(){s=(s*9301+49297)%233280;return s/233280;}
    var gc=["'",'"',',','`',';;','||','//','\\\\'];
    var rc=['o','(o)','O','[·]','(·)','·o·'];
    for(var i=0;i<180;i++)d.push({type:'grass',x:rng()*WW,y:rng()*WH,ch:gc[Math.floor(rng()*gc.length)],col:'hsl('+(95+rng()*35)+','+(55+rng()*25)+'%,'+(38+rng()*18)+'%)'});
    for(var j=0;j<50;j++)d.push({type:'rock',x:rng()*WW,y:rng()*WH,ch:rc[Math.floor(rng()*rc.length)],col:'hsl(35,'+(15+rng()*15)+'%,'+(48+rng()*20)+'%)'});
    [[250,130],[455,210],[648,145],[848,330],[250,390],[455,570],[760,465],[1010,565],[160,480],[900,640]].forEach(function(p){d.push({type:'shroom',x:p[0],y:p[1]});});
    var bc=['#D14B35','#C49A3C','#2B4C8C','#5BAD72','#e04080'];
    [{x:340,y:160,ph:0},{x:610,y:310,ph:1.5},{x:870,y:210,ph:.8},{x:195,y:455,ph:2.2},{x:720,y:665,ph:1.1},{x:455,y:745,ph:3.0},{x:1050,y:300,ph:.4}].forEach(function(b,i){d.push({type:'butterfly',x:b.x,y:b.y,ph:b.ph,col:bc[i%bc.length]});});
    [{x:145,y:210,ph:.3},{x:548,y:155,ph:1.8},{x:755,y:390,ph:.9},{x:300,y:510,ph:2.5},{x:930,y:260,ph:1.2},{x:1080,y:180,ph:.6}].forEach(function(b){d.push({type:'bee',x:b.x,y:b.y,ph:b.ph});});
    [{x:210,y:500},{x:410,y:670},{x:910,y:490}].forEach(function(w){d.push({type:'worm',x:w.x,y:w.y});});
    d.push({type:'pond',x:1030,y:730,w:120,h:80});
    d.push({type:'cat',x:1070,y:410,ph:0});
    d.push({type:'can',x:980,y:720});
    d.push({type:'tools',x:1095,y:200});
    [{x:62,y:58,t:'milpa'},{x:260,y:58,t:'flores'},{x:458,y:58,t:'chiles'},{x:656,y:58,t:'aguacate'},{x:854,y:58,t:'jitomates'},{x:62,y:218,t:'nopal'},{x:260,y:218,t:'cítricos'},{x:458,y:218,t:'verduras'},{x:656,y:218,t:'hierbas'},{x:854,y:218,t:'poliniz.'},{x:62,y:378,t:'compostera'},{x:462,y:378,t:'espiral'},{x:62,y:538,t:'comunitario'}].forEach(function(s){d.push({type:'sign',x:s.x,y:s.y,text:s.t});});
    for(var fx=50;fx<WW-20;fx+=90)d.push({type:'post',x:fx,y:24,horiz:true});
    for(var fy=60;fy<WH-20;fy+=90)d.push({type:'post',x:24,y:fy,horiz:false});
    var fl=['✿','❀','✾','❁','✽'],fc=['#D14B35','#C49A3C','#2B4C8C','#5BAD72','#e04080'];
    [{x:170,y:160},{x:370,y:230},{x:568,y:165},{x:766,y:155},{x:964,y:165},{x:170,y:320},{x:370,y:395},{x:568,y:325},{x:766,y:315},{x:964,y:325},{x:460,y:485},{x:900,y:515},{x:200,y:640},{x:600,y:640},{x:900,y:640}].forEach(function(f,i){d.push({type:'flower',x:f.x,y:f.y,ch:fl[i%fl.length],col:fc[i%fc.length]});});
    return d;
  }

  var canvas,ctx,tooltipEl,DECOR=[];
  var camX=80,camY=60,last=0,sanim=0;
  var sx=180,sy=160,sdir=1,tgt=null,dig=false,hovP=null,autoA=0,rafId=null;
  var keys={},activeTabs={};

  function inView(wx,wy,p){p=p||70;return wx>camX-p&&wx<camX+CW+p&&wy>camY-p&&wy<camY+CH+p;}
  function wp(wx,wy){return{px:Math.round(wx-camX),py:Math.round(wy-camY)};}
  function lighten(hex,a){a=a||15;var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return'rgb('+Math.min(255,r+a*2)+','+Math.min(255,g+a*2)+','+Math.min(255,b+a*2)+')';}

  function drawGround(){
    ctx.fillStyle='#7ab84a';ctx.fillRect(0,0,CW,CH);
    ctx.fillStyle='rgba(90,144,40,0.45)';
    for(var gx=camX%6;gx<CW;gx+=6)for(var gy=camY%6;gy<CH;gy+=6){var wx=gx+camX,wy=gy+camY;if(((wx*7+wy*13)%11)<3)ctx.fillRect(gx,gy,2,2);}
    ctx.fillStyle='rgba(160,210,80,0.22)';
    for(var gx2=camX%24;gx2<CW;gx2+=24)for(var gy2=camY%24;gy2<CH;gy2+=24){var wx2=gx2+camX,wy2=gy2+camY;if(((wx2*3+wy2*7)%17)<5)ctx.fillRect(gx2,gy2,10,8);}
    [58,256,454,652,850,1048].forEach(function(v){var px2=v-camX;if(px2>CW+20||px2+18<-20)return;ctx.fillStyle=PAL.path;ctx.fillRect(px2,0,18,CH);ctx.fillStyle=PAL.pathDark;ctx.fillRect(px2,0,1,CH);ctx.fillRect(px2+17,0,1,CH);});
    [58,238,398,558,738].forEach(function(v){var py2=v-camY;if(py2>CH+20||py2+18<-20)return;ctx.fillStyle=PAL.path;ctx.fillRect(0,py2,CW,18);ctx.fillStyle=PAL.pathDark;ctx.fillRect(0,py2,CW,1);ctx.fillRect(0,py2+17,CW,1);});
  }

  function drawDecors(){
    DECOR.forEach(function(d){
      if(!inView(d.x,d.y,90))return;
      var p=wp(d.x,d.y),px=p.px,py=p.py;
      ctx.save();
      if(d.type==='grass'){ctx.font='9px monospace';ctx.fillStyle=d.col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(d.ch,px,py);}
      else if(d.type==='rock'){ctx.font='10px monospace';ctx.fillStyle=d.col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(d.ch,px,py);}
      else if(d.type==='flower'){ctx.font='11px serif';ctx.fillStyle=d.col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.translate(px,py);ctx.rotate(Math.sin(sanim*.6+d.x*.02)*.1);ctx.fillText(d.ch,0,0);}
      else if(d.type==='shroom'){ctx.font='13px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🍄',px,py);}
      else if(d.type==='butterfly'){var bx=px+Math.sin(sanim*1.8+d.ph)*28,by=py+Math.cos(sanim*1.2+d.ph)*18;ctx.font='11px serif';ctx.fillStyle=d.col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('~~❯',bx,by);}
      else if(d.type==='bee'){var bx2=px+Math.sin(sanim*3.2+d.ph)*22,by2=py+Math.cos(sanim*2.4+d.ph)*14;ctx.font='12px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🐝',bx2,by2);ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('zz',bx2+12,by2-5);}
      else if(d.type==='worm'){ctx.font='9px monospace';ctx.fillStyle='#c07850';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('~www~',px+Math.sin(sanim*.8+d.x*.015)*3,py);}
      else if(d.type==='sign'){ctx.fillStyle=PAL.woodDk;ctx.fillRect(px-1,py,3,14);ctx.fillStyle=PAL.cream;ctx.beginPath();ctx.roundRect(px-20,py-14,40,14,2);ctx.fill();ctx.strokeStyle=PAL.woodDk;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(px-20,py-14,40,14,2);ctx.stroke();ctx.fillStyle=PAL.ink;ctx.font='bold 7px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(d.text,px,py-7);}
      else if(d.type==='cat'){var cy=py+Math.sin(sanim*.45+d.ph)*3;ctx.font='16px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(Math.floor(sanim*1.5)%9===0?'😸':'😺',px,cy);}
      else if(d.type==='can'){ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🪣',px,py);}
      else if(d.type==='tools'){ctx.font='bold 11px monospace';ctx.fillStyle=PAL.woodDk;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⌇',px,py);ctx.fillText('|',px+12,py+10);ctx.font='7px monospace';ctx.fillStyle=PAL.inkL;ctx.fillText('rastrillo',px,py+16);}
      else if(d.type==='pond'){var pp=wp(d.x,d.y);ctx.fillStyle='#7ac0e8';ctx.beginPath();ctx.ellipse(pp.px,pp.py,d.w/2,d.h/2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#4a90c8';ctx.lineWidth=2;ctx.stroke();for(var ri=1;ri<=2;ri++){var rp=(sanim*.5+ri*.5)%1;ctx.globalAlpha=.4*(1-rp);ctx.strokeStyle='#a0d8f0';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(pp.px,pp.py,d.w*.18*ri+rp*16,d.h*.18*ri+rp*8,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}ctx.font='12px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🐸',pp.px-16,pp.py+6);ctx.fillText('🐟',pp.px+12,pp.py-6);}
      else if(d.type==='post'){ctx.fillStyle=PAL.woodDk;if(d.horiz)ctx.fillRect(px-2,py,4,16);else ctx.fillRect(px,py-2,16,4);}
      ctx.restore();
    });
  }

  function drawBed(b){
    if(!inView(b.x+b.w/2,b.y+b.h/2,20))return;
    var p=wp(b.x,b.y),px=p.px,py=p.py;
    ctx.fillStyle='rgba(0,0,0,0.12)';ctx.beginPath();ctx.roundRect(px+3,py+3,b.w,b.h,6);ctx.fill();
    ctx.fillStyle=PAL.soilDark;ctx.beginPath();ctx.roundRect(px,py,b.w,b.h,6);ctx.fill();
    ctx.fillStyle=PAL.soilMid;ctx.beginPath();ctx.roundRect(px+1,py+1,b.w-2,b.h-2,5);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.lineWidth=1;
    for(var row=10;row<b.h-4;row+=12){ctx.beginPath();ctx.moveTo(px+7,py+row);ctx.lineTo(px+b.w-7,py+row);ctx.stroke();}
    ctx.strokeStyle=PAL.soilDark;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(px,py,b.w,b.h,6);ctx.stroke();
  }

  function drawPlant(p){
    var bed=BEDS[p.bed],wx=bed.x+bed.w*p.ox,wy=bed.y+bed.h*p.oy;
    if(!inView(wx,wy,55))return;
    var pos=wp(wx,wy),px=pos.px,py=pos.py,isH=hovP===p;
    ctx.save();
    if(isH){ctx.shadowColor='rgba(196,154,60,0.8)';ctx.shadowBlur=20;}
    ctx.fillStyle='rgba(0,0,0,0.15)';ctx.beginPath();ctx.ellipse(px+2,py+3,p.r*.85,p.r*.4,0,0,Math.PI*2);ctx.fill();
    var phase=isH?sanim*.25:sanim*.07;
    for(var i=0;i<6;i++){var a=(i/6)*Math.PI*2+phase;ctx.fillStyle=isH?lighten(p.bg,25):p.bg;ctx.beginPath();ctx.arc(px+Math.cos(a)*p.r*.72,py+Math.sin(a)*p.r*.72,p.r*.55,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle=isH?lighten(p.c,18):p.c;ctx.beginPath();ctx.arc(px,py,p.r*.72,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.2)';ctx.beginPath();ctx.arc(px-p.r*.18,py-p.r*.18,p.r*.3,0,Math.PI*2);ctx.fill();
    ctx.font=Math.round(p.r*.9)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.emoji,px,py+1);
    if(isH){ctx.strokeStyle=PAL.gold;ctx.lineWidth=1.8;ctx.setLineDash([5,3]);ctx.beginPath();ctx.arc(px,py,p.r+9,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    ctx.restore();
  }

  function drawSprite(){
    var pos=wp(sx,sy),px=pos.px,py=pos.py;
    ctx.save();ctx.translate(px,py);
    ctx.fillStyle='rgba(0,0,0,0.18)';ctx.beginPath();ctx.ellipse(1,6,7,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=PAL.green;ctx.beginPath();ctx.moveTo(-7,2);ctx.lineTo(-10,10);ctx.lineTo(10,10);ctx.lineTo(7,2);ctx.closePath();ctx.fill();
    var ll=dig?Math.sin(sanim*8)*2:Math.sin(sanim*6)*2,lr=-ll;
    ctx.fillStyle='#f0c898';ctx.fillRect(-5,8,4,6+ll);ctx.fillRect(1,8,4,6+lr);
    ctx.fillStyle=PAL.red;ctx.beginPath();ctx.ellipse(-3,14+ll,4,2.5,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(3,14+lr,4,2.5,0,0,Math.PI*2);ctx.fill();
    var bob=Math.sin(sanim*6)*(dig?1.5:.3);
    ctx.fillStyle=PAL.green;ctx.beginPath();ctx.ellipse(0,-2+bob,6,7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=PAL.gold;ctx.fillRect(-6,1+bob,12,2);
    ctx.fillStyle='#f0c898';var arm=Math.sin(sanim*6)*3;
    ctx.beginPath();ctx.ellipse(-8,-1+arm,2.5,3,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(8,-1-arm,2.5,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f0c898';ctx.fillRect(-2,-8+bob,4,4);ctx.beginPath();ctx.ellipse(0,-12+bob,5,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2d1008';
    ctx.beginPath();ctx.ellipse(0,-14+bob,5.5,4,0,0,Math.PI);ctx.fill();
    ctx.beginPath();ctx.ellipse(-5.5,-12+bob,2,5,-.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(5.5,-12+bob,2,5,.3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(5,-10+bob,1.5,4,.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=PAL.gold;ctx.beginPath();ctx.ellipse(0,-15+bob,7.5,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e0b030';ctx.beginPath();ctx.ellipse(0,-15+bob,4.5,2,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=PAL.gold;ctx.fillRect(-4,-19+bob,8,5);
    ctx.fillStyle=PAL.red;ctx.fillRect(-4,-15+bob,8,1.5);
    if(dig){ctx.fillStyle=PAL.woodDk;ctx.save();ctx.translate(9,0+bob);ctx.rotate(Math.sin(sanim*8)*.55);ctx.fillRect(0,-1,13,2);ctx.fillRect(11,-3,2,5);ctx.restore();}
    ctx.restore();
  }

  function drawMinimap(){
    var mm={x:CW-74,y:CH-60,w:66,h:52};
    ctx.fillStyle='rgba(250,247,242,0.9)';ctx.beginPath();ctx.roundRect(mm.x,mm.y,mm.w,mm.h,4);ctx.fill();
    ctx.strokeStyle='rgba(42,107,63,0.35)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(mm.x,mm.y,mm.w,mm.h,4);ctx.stroke();
    BEDS.forEach(function(b){ctx.fillStyle='rgba(120,72,36,0.7)';ctx.fillRect(mm.x+b.x/WW*mm.w,mm.y+b.y/WH*mm.h,b.w/WW*mm.w,b.h/WH*mm.h);});
    PLANTS.forEach(function(p){var bed=BEDS[p.bed],wx=bed.x+bed.w*p.ox,wy=bed.y+bed.h*p.oy;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(mm.x+wx/WW*mm.w,mm.y+wy/WH*mm.h,1.8,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle=PAL.red;ctx.beginPath();ctx.arc(mm.x+sx/WW*mm.w,mm.y+sy/WH*mm.h,2.5,0,Math.PI*2);ctx.fill();
    var vx=camX/WW*mm.w,vy=camY/WH*mm.h,vw=CW/WW*mm.w,vh=CH/WH*mm.h;
    ctx.strokeStyle=PAL.gold;ctx.lineWidth=.8;ctx.strokeRect(mm.x+vx,mm.y+vy,vw,vh);
  }

  function hitPlant(mx,my){
    var wx=mx+camX,wy=my+camY,best=null,bd=62;
    PLANTS.forEach(function(p){var bed=BEDS[p.bed],px=bed.x+bed.w*p.ox,py=bed.y+bed.h*p.oy,d=Math.hypot(wx-px,wy-py);if(d<bd&&d<p.r+26){bd=d;best=p;}});
    return best;
  }

  function showTip(p){
    document.getElementById('hg-tt-emoji').textContent=p.emoji;
    document.getElementById('hg-tt-name').textContent=p.name;
    document.getElementById('hg-tt-stat').textContent=p.stat;
    buildTabs(p,activeTabs[p.name]||0);
    tooltipEl.classList.add('hg-tooltip--visible');
  }
  function buildTabs(p,ai){
    var te=document.getElementById('hg-tt-tabs'),be=document.getElementById('hg-tt-body');
    te.innerHTML='';be.innerHTML='';
    p.facts.forEach(function(f,i){var btn=document.createElement('button');btn.className='hg-tt-tab'+(i===ai?' hg-tt-tab--active':'');btn.textContent=f.tab;btn.onclick=function(){activeTabs[p.name]=i;buildTabs(p,i);};te.appendChild(btn);});
    var f=p.facts[ai];be.innerHTML=f.text+(f.fun?'<div class="hg-tt-fun">🌱 '+f.fun+'</div>':'');
  }
  function posTip(mx,my){
    var w=245,h=200,tx=mx+22,ty=my-h-10;
    if(tx+w>canvas.offsetWidth)tx=mx-w-22;
    if(ty<44)ty=my+22;
    tooltipEl.style.left=tx+'px';tooltipEl.style.top=ty+'px';
  }

  function loop(ts){
    var dt=Math.min((ts-last)/1000,.05);last=ts;sanim+=dt;
    var moved=false;
    if(keys['ArrowLeft']||keys['a']){sx-=90*dt;sdir=-1;moved=true;}
    if(keys['ArrowRight']||keys['d']){sx+=90*dt;sdir=1;moved=true;}
    if(keys['ArrowUp']||keys['w']){sy-=90*dt;moved=true;}
    if(keys['ArrowDown']||keys['s']){sy+=90*dt;moved=true;}
    sx=Math.max(30,Math.min(WW-30,sx));sy=Math.max(30,Math.min(WH-30,sy));
    if(tgt&&!tgt.isPoint&&hovP){
      var bed=BEDS[tgt.bed],tx2=bed.x+bed.w*tgt.ox,ty2=bed.y+bed.h*tgt.oy,dx=tx2-sx,dy=ty2-sy,dist=Math.hypot(dx,dy);
      if(dist>8){dig=false;sdir=dx>0?1:-1;sx+=dx/dist*95*dt;sy+=dy/dist*95*dt;}else dig=true;
    }else if(tgt&&tgt.isPoint){
      var dx2=tgt.x-sx,dy2=tgt.y-sy,dist2=Math.hypot(dx2,dy2);
      if(dist2>8){sdir=dx2>0?1:-1;sx+=dx2/dist2*95*dt;sy+=dy2/dist2*95*dt;}else tgt=null;
    }else if(!moved){
      autoA+=dt*.32;sx+=Math.cos(autoA)*28*dt;sy+=Math.sin(autoA*.65)*18*dt;
      sx=Math.max(40,Math.min(WW-40,sx));sy=Math.max(40,Math.min(WH-40,sy));
      sdir=Math.cos(autoA)>0?1:-1;
    }
    camX=Math.max(0,Math.min(WW-CW,sx-CW/2));
    camY=Math.max(0,Math.min(WH-CH,sy-CH/2));
    ctx.clearRect(0,0,CW,CH);
    drawGround();drawDecors();BEDS.forEach(drawBed);
    PLANTS.slice().sort(function(a,b){return(BEDS[a.bed].y+BEDS[a.bed].h*a.oy)-(BEDS[b.bed].y+BEDS[b.bed].h*b.oy);}).forEach(drawPlant);
    drawSprite();drawMinimap();
    rafId=requestAnimationFrame(loop);
  }

  function openOverlay(){
    document.getElementById('hg-overlay').classList.add('hg-overlay--open');
    document.body.style.overflow='hidden';
    sx=180;sy=160;sdir=1;tgt=null;dig=false;hovP=null;autoA=0;sanim=0;last=0;
    rafId=requestAnimationFrame(loop);
  }
  function closeOverlay(){
    document.getElementById('hg-overlay').classList.remove('hg-overlay--open');
    document.body.style.overflow='';
    if(rafId){cancelAnimationFrame(rafId);rafId=null;}
    tooltipEl.classList.remove('hg-tooltip--visible');
  }

  function init(){
    DECOR=buildDecor();
    var overlay=document.createElement('div');
    overlay.id='hg-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','Huerto ITAM — jardín interactivo');
    overlay.innerHTML=[
      '<div class="hg-modal">',
      '<button class="hg-close-btn" id="hg-close" aria-label="Cerrar jardín">✕</button>',
      '<div class="hg-modal-header"><span class="hg-modal-logo">Huerto ITAM</span><span class="hg-modal-hint">click para caminar · hover para descubrir · ↑↓←→</span></div>',
      '<div class="hg-canvas-wrap">',
      '<canvas id="hg-canvas"></canvas>',
      '<div class="hg-tooltip" id="hg-tooltip">',
      '<div class="hg-tt-top"><span class="hg-tt-emoji" id="hg-tt-emoji"></span><div class="hg-tt-name" id="hg-tt-name"></div><div class="hg-tt-stat" id="hg-tt-stat"></div></div>',
      '<div class="hg-tt-tabs" id="hg-tt-tabs"></div>',
      '<div class="hg-tt-body" id="hg-tt-body"></div>',
      '</div></div>',
      '<div class="hg-modal-cv">',
      '<div class="hg-cv-years"><span class="hg-cv-num">4</span><span class="hg-cv-label">años</span></div>',
      '<div class="hg-cv-info">',
      '<span class="hg-cv-tag">Sustainability · Leadership</span>',
      '<div class="hg-cv-title">Presidenta — Huerto ITAM</div>',
      '<div class="hg-cv-sub">VP 2022–2025 · Presidenta 2026→</div>',
      '<div class="hg-cv-desc">Diseñé e implementé el modelo de negocio que mantiene el huerto autosustentable. Gestión de comunidad, estrategia verde y liderazgo estudiantil en ITAM, Ciudad de México.</div>',
      '<div class="hg-cv-skills"><span>Strategy</span><span>Community</span><span>Sustainability</span><span>Leadership</span><span>Business model</span></div>',
      '</div></div></div>',
    ].join('');
    document.body.appendChild(overlay);

    canvas=document.getElementById('hg-canvas');ctx=canvas.getContext('2d');
    tooltipEl=document.getElementById('hg-tooltip');
    canvas.width=CW;canvas.height=CH;

    document.getElementById('hg-close').addEventListener('click',closeOverlay);
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeOverlay();});
    document.addEventListener('keydown',function(e){
      var open=document.getElementById('hg-overlay').classList.contains('hg-overlay--open');
      if(open&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
      keys[e.key]=true;
      if(e.key==='Escape')closeOverlay();
    });
    document.addEventListener('keyup',function(e){keys[e.key]=false;});
    canvas.addEventListener('mousemove',function(e){
      var r=canvas.getBoundingClientRect(),mx=(e.clientX-r.left)*(CW/r.width),my=(e.clientY-r.top)*(CH/r.height);
      var p=hitPlant(mx,my);
      if(p!==hovP){hovP=p;if(p){tgt=p;showTip(p);}else tooltipEl.classList.remove('hg-tooltip--visible');}
      if(p)posTip(mx,my);
    });
    canvas.addEventListener('mouseleave',function(){hovP=null;tooltipEl.classList.remove('hg-tooltip--visible');});
    canvas.addEventListener('click',function(e){
      var r=canvas.getBoundingClientRect();
      tgt={isPoint:true,x:(e.clientX-r.left)*(CW/r.width)+camX,y:(e.clientY-r.top)*(CH/r.height)+camY};
    });

    document.querySelectorAll('.plant-obj').forEach(function(el){
      el.style.cursor='pointer';
      el.setAttribute('title','Click para visitar el huerto');
      el.addEventListener('click',openOverlay);
    });
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
