#pragma once
#include "round_support.h"
#if defined(PBL_ROUND)
/* Preserve the original/Nokia/RAZR glyph families and typing buffers. */
static inline bool r_t9_pixel(char c,int row,int col){
 if(s_razr || s_original){
  if(c==':' || c=='\'')return col==2 && ((c==':' && (row==2 || row==5)) || (c=='\'' && row<2));
  if(c=='+')return row==3 || (col==2 && row>=1 && row<=5);
  if(c=='*'){static const uint8_t v[]={4,21,14,31,14,21,4};return v[row]&(1<<(4-col));}
  if(c=='#'){static const uint8_t v[]={10,10,31,10,31,10,10};return v[row]&(1<<(4-col));}
  int n=razr_index(c);return n>=0 && (RAZR_GLYPHS[n][row]&(1<<(4-col)));
 }
 const LcdGlyph *g=lcd_glyph(c);return g && col<g->width && (g->rows[row]&(1<<(g->width-1-col)));
}
static inline int r_t9_advance(char c){if(s_razr || s_original)return 6;const LcdGlyph *g=lcd_glyph(c);return g?g->advance:4;}
static inline void r_t9_text(GContext *ctx,const char *text,const char *target,int x,int y,int max_width,int height,uint32_t ink,bool cursor){
 int source_h=s_razr || s_original?7:LCD_GLYPH_HEIGHT,source_width=text_width(target,1),actual=text_width(text,1);if(actual>source_width)source_width=actual;if(source_width<1)source_width=1;
 int width=source_width*height/source_h;if(width>max_width){width=max_width;height=width*source_h/source_width;}
 int left=x+(max_width-width)/2,offset=0;graphics_context_set_fill_color(ctx,GColorFromHEX(ink));
 for(int i=0;text[i];i++){
  int advance=r_t9_advance(text[i]);int columns=(s_razr || s_original)?5:advance;
  for(int row=0;row<source_h;row++)for(int col=0;col<columns;col++)if(r_t9_pixel(text[i],row,col)){
   int px=rr(left)+(offset+col)*rr(width)/source_width,py=rr(y)+row*rr(height)/source_h;
   int pw=(offset+col+1)*rr(width)/source_width-(offset+col)*rr(width)/source_width,ph=(row+1)*rr(height)/source_h-row*rr(height)/source_h;
   rcheck(px,py,pw>0?pw:1,ph>0?ph:1);graphics_fill_rect(ctx,GRect(px,py,pw>0?pw:1,ph>0?ph:1),0,GCornerNone);
  }
  offset+=advance;
 }
 if(cursor){int end=left+offset*width/source_width;if(end>x+max_width-4)end=x+max_width-4;rfill(ctx,end,y+height-2,4,2,0,ink);}
}
static void round_t9(GContext *ctx){
 uint32_t bg=s_use_model_colors?(s_razr?(s_razr_palette?0xAAAAAA:RAZR_BACKGROUND_COLOR):DEFAULT_BACKGROUND_COLOR):s_background_color;
 uint32_t fg=s_use_model_colors?(s_razr?(s_razr_palette?0:RAZR_TEXT_COLOR):DEFAULT_TEXT_COLOR):s_text_color;
 r_layout_bad=false;rclear(ctx,bg);
 if(s_show_battery){rline(ctx,34,25,47,25,1,fg);rline(ctx,34,33,47,33,1,fg);rline(ctx,34,25,34,33,1,fg);rline(ctx,47,25,47,33,1,fg);int percent=battery_state_service_peek().charge_percent;if(percent)rfill(ctx,36,27,9*percent/100,4,0,fg);}
 r_t9_text(ctx,s_time.numeric,s_time.numeric,78,24,64,10,fg,false);rline(ctx,27,38,153,38,1,fg);
 char shown[40],target[40];combine_hour(shown,sizeof(shown));snprintf(target,sizeof(target),"%s%s%s",s_time.hour[0],s_time.hour_count>1?" ":"",s_time.hour_count>1?s_time.hour[1]:"");
 r_t9_text(ctx,shown,target,22,45,136,13,fg,s_timer && s_token<s_time.hour_count);
 bool cursor=s_timer && s_token>=s_time.hour_count && s_token<s_time.hour_count+s_time.minute_count;
 if(s_time.minute_count==1)r_t9_text(ctx,s_minute_display[0],s_time.minute[0],20,74,140,20,fg,cursor);
 else{r_t9_text(ctx,s_minute_display[0],s_time.minute[0],20,65,140,17,fg,cursor && s_token==s_time.hour_count);r_t9_text(ctx,s_minute_display[1],s_time.minute[1],20,87,140,17,fg,cursor && s_token==s_time.hour_count+1);}
 static const char *labels[]={"1","2","3","4","5","6","7","8","9","*","0","#"};
 static const char *letters[]={"","ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ","","+",""};
 const int lefts[4][3]={{26,74,122},{30,76,122},{36,77,118},{52,80,108}},widths[]={32,28,26,20};
 for(int row=0;row<4;row++){
  int y=112+row*14;
  if(s_razr){int left=lefts[row][0],right=lefts[row][2]+widths[row];int points[][2]={{left,y+7},{left+2,y},{left+widths[row]-2,y},{left+widths[row]+4,y+10},{right-widths[row]-4,y+10},{right-widths[row]+2,y},{right-2,y},{right,y+7}};for(int i=1;i<8;i++)rline(ctx,points[i-1][0],points[i-1][1],points[i][0],points[i][1],1,fg);}
  for(int col=0;col<3;col++){
   int n=row*3+col,key=n<9?n+1:n==10?0:-1,x=lefts[row][col],w=widths[row];bool active=key>0 && key==s_highlight_key;
   if(!s_razr || active){rfill(ctx,x,y,w,14,s_original?1:4,fg);if(!active)rfill(ctx,x+1,y+1,w-2,12,s_original?0:3,bg);}
   uint32_t ink=active?bg:fg;
   if(s_razr){r_t9_text(ctx,labels[n],labels[n],x+2,y+1,8,7,ink,false);if(letters[n][0])r_t9_text(ctx,letters[n],letters[n],x+10,y+3,w-11,5,ink,false);}
   else{r_t9_text(ctx,labels[n],labels[n],x,y+1,w,6,ink,false);if(letters[n][0])r_t9_text(ctx,letters[n],letters[n],x,y+8,w,5,ink,false);}
  }
 }
}
#endif
