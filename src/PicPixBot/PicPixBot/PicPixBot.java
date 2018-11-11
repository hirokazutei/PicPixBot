import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class Sketch_Test extends PApplet {

PImage inimg;
PGraphics outimg;

int pixeltype;
int samplesize;
int blacklines;
int clusternum;
float[][] clusterposition = new float[127][4];
int[] position = new int[4];
int clustercolor;


boolean problem = false;

public void setup() {
  inimg = loadImage("inimg.png");
  String[] intext = loadStrings("../intext.txt");
  String[] strparameters = split(intext[0], ' ');
  int[] parameters = new int[5];
  

  /*2
   PARAMETERS
   0. Twitter Handle
   1. Pixel Type: 0 for Random
   2. Pixel Size
   3. Black Lines: 0 for no Lines
   4. Cluster Number: 0 for No Cluster
   5. Image Link
   */

  if (strparameters.length < 4) {
    problem = true;
  } else {
    for (int i = 1; i < 4; i++) {
      parameters[i] = PApplet.parseInt(strparameters[i]);
    }
  }
  if (PApplet.parseInt(parameters[1]) < 0 || PApplet.parseInt(parameters[1]) > 9 || PApplet.parseInt(parameters[2]) < 2 || PApplet.parseInt(parameters[2]) > 256 || PApplet.parseInt(parameters[3]) < 2 || PApplet.parseInt(parameters[3]) > 124) {
    problem = true;
  }
  if (problem != true) {
    outimg = createGraphics(inimg.width, inimg.height);
    pixeltype = parameters[1];
    samplesize = parameters[2];
    clusternum = parameters[3];
  } else {
    outimg = createGraphics(inimg.width, inimg.height);
    pixeltype = PApplet.parseInt(random(1, 9));
    samplesize = PApplet.parseInt(random(2, 50));
    clusternum = PApplet.parseInt(random(10, 100));
  }
}

public void draw() {
  outimg.beginDraw();
  outimg.colorMode(RGB, 100);
  outimg.background(0, 0, 0);
  colorMode(RGB, 100);
  inimg.loadPixels();
  outimg.loadPixels();
  cluster();
  outimg.noStroke();
  switch(pixeltype) {
  case 0: 
    palette();
    break;
  case 1: 
    square();
    break;
  case 2: 
    vtriangle();
    break;
  case 3: 
    htriangle();
    break;
  case 4: 
    circle();
    outimg.endDraw();
    break;
  case 5: 
    scircle();
    outimg.endDraw();
    break;
  case 6: 
    hbrick();
    break;
  case 7: 
    vbrick();
    break;
  case 8: 
    octagon();
    break;
  case 9: 
    custom();
    break;
  }


  outimg.updatePixels();
  outimg.save("outimg.png");
  exit();
}

//##################################################### SQUARE #####################################################
public void square() {
  float[] pointcolor = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int x1, y1;
  for (int y = 0; y < inimg.height + samplesize; y = y + samplesize) {
    for (int x = 0; x < inimg.width + samplesize; x = x + samplesize) {
      if (x >= inimg.width) {
        x1 = inimg.width - 1;
      } else {
        x1 = x;
      }
      if (y >= inimg.height) {
        y1 = inimg.height - 1;
      } else {
        y1 = y;
      }
      pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
      closest = 0;
      mostprox = 0;
      for (int i = 0; i < clusternum; i++) {
        proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
        if (mostprox == 0 || proximity < mostprox) {
          closest = i;
          mostprox = proximity;
        }
      }
      clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      for (int ya = 0; ya < samplesize && ya + y < inimg.height; ya++) {
        for (int xa = 0; xa < samplesize && xa + x < inimg.width; xa++) {
          outimg.pixels[(x + xa) + ((y + ya) * outimg.width)] = clustercolor;
          //outimg.set((x + xa), (y + ya), clustercolor);
        }
      }
    }
  }
}

//##################################################### V BRICK #####################################################
public void vbrick() {
  float[] pointcolor = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int x1, y1;
  for (int y = 0; y < inimg.height; y = y + samplesize*2) {
    for (int x = 0; x < inimg.width; x = x + samplesize/2) {
      if (x >= inimg.width) {
        x1 = inimg.width - 1;
      } else {
        x1 = x;
      }
      if (y >= inimg.height) {
        y1 = inimg.height - 1;
      } else {
        y1 = y;
      }      
      pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
      closest = 0;
      mostprox = 0;
      for (int i = 0; i < clusternum; i++) {
        proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
        if (mostprox == 0 || proximity < mostprox) {
          closest = i;
          mostprox = proximity;
        }
      }
      clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      for (int ya = 0; ya < samplesize*2 && ya + y < inimg.height; ya++) {
        for (int xa = 0; xa < samplesize/2 && xa + x < inimg.width; xa++) {
          outimg.pixels[(x + xa) + ((y + ya) * outimg.width)] = clustercolor;
          //outimg.set((x + xa), (y + ya), clustercolor);
        }
      }
    }
  }
}

//#####################################################  BRICK #####################################################
public void hbrick() {
  float[] pointcolor = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int x1, y1;
  for (int y = 0; y < inimg.height; y = y + samplesize/2) {
    for (int x = 0; x < inimg.width; x = x + samplesize*2) {
      if (x >= inimg.width) {
        x1 = inimg.width - 1;
      } else {
        x1 = x;
      }
      if (y >= inimg.height) {
        y1 = inimg.height - 1;
      } else {
        y1 = y;
      }
      pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
      closest = 0;
      mostprox = 0;
      for (int i = 0; i < clusternum; i++) {
        proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
        if (mostprox == 0 || proximity < mostprox) {
          closest = i;
          mostprox = proximity;
        }
      }
      clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      for (int ya = 0; ya < samplesize/2 && ya + y < inimg.height; ya++) {
        for (int xa = 0; xa < samplesize*2 && xa + x < inimg.width; xa++) {
          outimg.pixels[(x + xa) + ((y + ya) * outimg.width)] = clustercolor;
          //outimg.set((x + xa), (y + ya), clustercolor);
        }
      }
    }
  }
}

//##################################################### PLETTE #####################################################
float[][] palettecolor = new float[128][3];
int pcolors = 0;
int mostfrequent = 0;
int maxed = 2147483646;

public void palette() {
  print(samplesize);
  while (pcolors < samplesize) {
    mostfrequent = 0;
    for (int i = 0; i <= clusternum; i++) {
      if ((clusterposition[i][3] > clusterposition[mostfrequent][3]) && clusterposition[i][3] < maxed) {
        mostfrequent = i;
      }
    }
    maxed = PApplet.parseInt(clusterposition[mostfrequent][3]);
    if (pcolors == 0 || (clusterposition[mostfrequent][0] != palettecolor[pcolors - 1][0] && clusterposition[mostfrequent][1] != palettecolor[pcolors - 1][1] && clusterposition[mostfrequent][2] != palettecolor[pcolors - 1][2])) {
      palettecolor[pcolors][0] = clusterposition[mostfrequent][0];
      palettecolor[pcolors][1] = clusterposition[mostfrequent][1];
      palettecolor[pcolors][2] = clusterposition[mostfrequent][2];
      pcolors++;
    } else {
      samplesize--;
    }
  }
  int palette_size = inimg.width/pcolors;
  for (int a = 0; a < pcolors; a++) {
    clustercolor = color(palettecolor[a][0], palettecolor[a][1], palettecolor[a][2]);
    for (int x = palette_size * a; x < palette_size * (a + 1); x++) {
      for (int y = 0; y < inimg.height; y++) {
        outimg.pixels[x + (y * outimg.width)] = clustercolor;
      }
    }
  }
}


//##################################################### V TRIANGLE #####################################################
//Change it into pixel
public void vtriangle() {
  float[] pointcolor = new float[3];
  int i, j;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  boolean flip = true;
  int x1, y1;
  for (int y = 0; y < inimg.height + samplesize; y = y + samplesize) {
    if ((y/samplesize)%2 == 0) {
      flip = false;
    } else {
      flip = true;
    }
    for (int x = -samplesize/2; x < inimg.width + samplesize; x = x + samplesize) {
      if (x < 0) {
        x1 = 0;
      } else if (x >= inimg.width) {
        x1 = inimg.width - 1;
      } else {
        x1 = x;
      }
      if (y < 0) {
        y1 = 0;
      } else if (y >= inimg.height) {
        y1 = inimg.height - 1;
      } else {
        y1 = y;
      }
      pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
      closest = 0;
      mostprox = 0;
      for (int a = 0; a < clusternum; a++) {
        proximity = (sq(pointcolor[0] - clusterposition[a][0]) + sq(pointcolor[1] - clusterposition[a][1]) + sq(pointcolor[2] - clusterposition[a][2]));
        if (mostprox == 0 || proximity < mostprox) {
          closest = a;
          mostprox = proximity;
        }
      }
      clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      i = samplesize;
      j = 0;
      if (flip) {
        flip = false;
      } else {
        flip = true;
      }
      for (int y2 = 0; y2 <= samplesize; y2++) {
        if (flip) {
          for (int x2 = -i; x2 <= i; x2++) {
            if (x + x2 < inimg.width && x + x2 >= 0 && y + y2 < inimg.height) {
              outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
            }
          }
          i--;
        } else {
          for (int x2 = -j; x2 <= j; x2++) {
            if (x + x2 < inimg.width && x + x2 >= 0 && y + y2 < inimg.height) {
              outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
            }
          }
          j++;
        }
      }
    }
  }
}

//##################################################### H TRIANGLE #####################################################
//Change it into pixel
public void htriangle() {
  float[] pointcolor = new float[3];
  int i, j;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  boolean flip = false;
  int x1, y1;
  for (int y = 0; y < inimg.height + samplesize; y = y + samplesize*2) {  
    if ((y/(samplesize*2))%2 == 0) {
      flip = false;
    } else {
      flip = true;
    }
    for (int x = 0; x < inimg.width; x = x + samplesize + 1) {
      for (int t = 0; t<2; t++) {
        if (x + samplesize * t/2  >= inimg.width) {
          x1 = (inimg.width - 1) - samplesize * t/2;
        } else if (x < 0) {
          x1 = samplesize * t/2;
        } else {
          x1 = x;
        }
        if (y  >= inimg.height) {
          y1 = (inimg.height - 1);
        } else {
          y1 = y;
        }
        pointcolor[0] = red(inimg.pixels[(x1 + samplesize * t/2) + ((y1) * inimg.width)]);
        pointcolor[1] = green(inimg.pixels[(x1 + samplesize * t/2) + ((y1) * inimg.width)]);
        pointcolor[2] = blue(inimg.pixels[(x1 + samplesize * t/2) + ((y1) * inimg.width)]);
        closest = 0;
        mostprox = 0;
        for (int a = 0; a < clusternum; a++) {
          proximity = (sq(pointcolor[0] - clusterposition[a][0]) + sq(pointcolor[1] - clusterposition[a][1]) + sq(pointcolor[2] - clusterposition[a][2]));
          if (mostprox == 0 || proximity < mostprox) {
            closest = a;
            mostprox = proximity;
          }
        }
        clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
        i = samplesize;
        j = 0;
        if (flip) {
          flip = false;
        } else {
          flip = true;
        }
        for (int x2 = 0; x2 <= samplesize; x2++) {
          if (flip) {
            for (int y2 = -i + samplesize; y2 <= i + samplesize; y2++) {
              if (x + x2 < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            i--;
          } else {
            for (int y3 = -j; y3 <= j; y3++) {
              if (x + x2 < inimg.width && y + y3 >= 0 && y + y3 < inimg.height) {
                outimg.pixels[(x + x2) + ((y + y3) * inimg.width)] = clustercolor;
              }
            }
            j++;
          }
        }
      }
    }
  }
}

//##################################################### CIRCLE #####################################################
//Change it into pixel
public void circle() {
  float[] pointcolor = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int x1, y1;
  for (int y = 0; y < inimg.height + samplesize; y = y + samplesize) {
    for (int x = 0; x < inimg.width + samplesize; x = x + samplesize) {
      //Currently, it is taking the top left corner and should take middle point
      if (x >= inimg.width) {
        x1 = (inimg.width - 1) - samplesize;
      } else {
        x1 = x;
      }
      if (y  >= inimg.height) {
        y1 = (inimg.height - 1) - samplesize;
      } else {
        y1 = y;
      }
      pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);

      closest = 0;
      mostprox = 0;
      for (int i = 0; i < clusternum; i++) {
        proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
        if (mostprox == 0 || proximity < mostprox) {
          closest = i;
          mostprox = proximity;
        }
      }
      clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      outimg.fill(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      outimg.ellipse(x, y, samplesize, samplesize);
    }
  }
}

//##################################################### SCIRCLE #####################################################
//Change it into pixel
public void scircle() {
  float[] pointcolor = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  boolean odd = true;
  int x1, y1;
  for (int y = 0; y < inimg.height + samplesize; y = y + samplesize) {
    odd = true;
    for (int x = 0; x < inimg.width + samplesize; x = x + samplesize) {
      if (x >= inimg.width) {
        x1 = (inimg.width - 1) - samplesize;
      } else {
        x1 = x;
      }
      if (y  >= inimg.height) {
        y1 = (inimg.height - 1) - samplesize;
      } else {
        y1 = y;
      }
      pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
      pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
      closest = 0;
      mostprox = 0;
      for (int i = 0; i < clusternum; i++) {
        proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
        if (mostprox == 0 || proximity < mostprox) {
          closest = i;
          mostprox = proximity;
        }
      }
      clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
      outimg.fill(clustercolor);
      if (odd) {
        outimg.ellipse(x, y, samplesize * 1.1f, samplesize);
        odd = false;
      } else {
        outimg.ellipse(x, y+samplesize/2, samplesize * 1.1f, samplesize);
        odd = true;
      }
    }
  }
}

//##################################################### OCTAGON #####################################################
//Change it into pixel
public void octagon() {
  if (samplesize % 2 != 0) {
    samplesize++;
  }
  float[] pointcolor = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int j;
  boolean increase = true;
  int x1, y1;
  for (int t = 0; t < 2; t++) {
    for (int y = -(samplesize * t); y < inimg.height + samplesize * 2; y = y + samplesize * 2) {
      for (int x = (samplesize * t * 2); x < inimg.width + samplesize * 4; x = x + samplesize* 4) {
        //Currently, it is taking the top left corner and should take middle point
        if (y < 0) {
          y1 = samplesize * t;
        } else if (y >= inimg.height) {
          y1 = inimg.height - 1;
        } else {
          y1 = y;
        }
        if (x - samplesize * t < 0) {
          x1 = samplesize * t;
        } else if (x + samplesize * t >= inimg.width) {
          x1 = inimg.width - (samplesize * t) - 1;
        } else {
          x1 = x;
        }
        pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
        closest = 0;
        mostprox = 0;
        for (int i = 0; i < clusternum; i++) {
          proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
          if (mostprox == 0 || proximity < mostprox) {
            closest = i;
            mostprox = proximity;
          }
        }
        clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
        j = 0;
        for (int y2 = 0; y2 < samplesize*2; y2++) {
          if (increase) {
            for (int x2 = -(samplesize/2 + j); x2 < samplesize/2 + j; x2++) {
              if (x + x2 < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j++;
            if (j >= samplesize) {
              increase = false;
            }
          } else {
            for (int x2 = -(samplesize/2 + j); x2 < samplesize/2 + j; x2++) {
              if (x + x2 < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j--;
            if (j <= 0) {
              increase = true;
            }
          }
        }
      }
    }
  }
}

//##################################################### CUSTOM #####################################################
//Change it into pixel
public void custom() {
  float[] pointcolor = new float[3];
  float[] pointcolor2 = new float[3];
  int clustercolor;
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int j, x1, y1;
  boolean increase = true;
  for (int t = 0; t < 2; t++) {
    for (int y = -(samplesize * t); y < inimg.height + samplesize * 2; y = y + samplesize * 2) {
      for (int x = (samplesize * t * 2); x < inimg.width + samplesize * 4; x = x + samplesize* 4) {
        //Currently, it is taking the top left corner and should take middle point
        if (y < 0) {
          y1 = samplesize * t;
        } else if (y >= inimg.height) {
          y1 = inimg.height - 1;
        } else {
          y1 = y;
        }
        if (x < 0) {
          x1 = samplesize * t;
        } else if (x >= inimg.width) {
          x1 = inimg.width - 1;
        } else {
          x1 = x;
        }
        pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
        closest = 0;
        mostprox = 0;
        for (int i = 0; i < clusternum; i++) {
          proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
          if (mostprox == 0 || proximity < mostprox) {
            closest = i;
            mostprox = proximity;
          }
        }
        clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
        j = 0;
        for (int y2 = 0; y2 < samplesize*2; y2++) {
          if (increase) {
            for (int x2 = -j; x2 <  j; x2++) {
              if (x + x2 < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j++;
            if (j >= samplesize) {
              increase = false;
            }
          } else {
            for (int x2 = -j; x2 < j; x2++) {
              if (x + x2 < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j--;
            if (j <= 0) {
              increase = true;
            }
          }
        }
      }
    }
  }
  for (int t = 0; t < 2; t++) {
    int sampler;
    if (t == 0) {
      sampler = -samplesize/2;
    } else {
      sampler = samplesize/2;
    }
    for (int y = -(samplesize * t); y < inimg.height + samplesize * 2; y = y + samplesize * 2) {
      for (int x = (samplesize * t * 2); x < inimg.width + samplesize * 4; x = x + samplesize* 4) {
        //Currently, it is taking the top left corner and should take middle point
        if (y < 0) {
          y1 = 0;
        } else if (y >= inimg.height) {
          y1 = inimg.height - 1;
        } else {
          y1 = y;
        }
        if (x + sampler < 0) {
          x1 = 0;
        } else if (x + sampler >= inimg.width) {
          x1 = inimg.width - abs(sampler);
        } else {
          x1 = x + sampler;
        }
        pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
        closest = 0;
        mostprox = 0;
        for (int i = 0; i < clusternum; i++) {
          proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
          if (mostprox == 0 || proximity < mostprox) {
            closest = i;
            mostprox = proximity;
          }
        }
        clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
        j = 0;
        for (int y2 = 0; y2 < samplesize*2; y2++) {
          if (increase) {
            for (int x2 = 0; x2 < samplesize; x2++) {
              if (x + x2 + j < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2 + j) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j++;
            if (j >= samplesize) {
              increase = false;
            }
          } else {
            for (int x2 = 0; x2 < samplesize; x2++) {
              if (x + x2 + j < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                //outimg.pixels[(x + x1 + j) + ((y + y1) * inimg.width)] = clustercolor;
              }
            }
            j--;
            if (j <= 0) {
              increase = true;
            }
          }
        }
      }
    }
  }
  for (int t = 0; t < 2; t++) {
    int sampler;
    if (t == 0) {
      sampler = -samplesize/2;
    } else {
      sampler = samplesize/2;
    }
    for (int y = -(samplesize * t); y < inimg.height + samplesize; y = y + samplesize * 2) {
      for (int x = (samplesize * t * 2); x < inimg.width + samplesize * 2; x = x + samplesize* 4) {
        if (y < 0) {
          y1 = 0;
        } else if (y + samplesize >= inimg.height) {
          y1 = inimg.height - 1;
        } else {
          y1 = y + samplesize * t;
        }
        if (x + sampler < 0) {
          x1 = 0;
        } else if (x + sampler >= inimg.width) {
          x1 = inimg.width - abs(sampler);
        } else {
          x1 = x + sampler;
        }
        pointcolor[0] = red(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[1] = green(inimg.pixels[x1 + (y1 * inimg.width)]);
        pointcolor[2] = blue(inimg.pixels[x1 + (y1 * inimg.width)]);
        closest = 0;
        mostprox = 0;
        for (int i = 0; i < clusternum; i++) {
          proximity = (sq(pointcolor[0] - clusterposition[i][0]) + sq(pointcolor[1] - clusterposition[i][1]) + sq(pointcolor[2] - clusterposition[i][2]));
          if (mostprox == 0 || proximity < mostprox) {
            closest = i;
            mostprox = proximity;
          }
        }
        clustercolor = color(clusterposition[closest][0], clusterposition[closest][1], clusterposition[closest][2]);
        j = 0;
        for (int y2 = 0; y2 < samplesize*2; y2++) {
          if (increase) {
            for (int x2 = 0; x2 < samplesize; x2++) {
              if (x + x2 + j < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                //outimg.pixels[(x + x2 + j) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j++;
            if (j >= samplesize) {
              increase = false;
            }
          } else {
            for (int x2 = 0; x2 < samplesize; x2++) {
              if (x + x2 + j < inimg.width && y + y2 >= 0 && y + y2 < inimg.height && x + x2 >= 0) {
                outimg.pixels[(x + x2 + j) + ((y + y2) * inimg.width)] = clustercolor;
              }
            }
            j--;
            if (j <= 0) {
              increase = true;
            }
          }
        }
      }
    }
  }
}


//##################################################### CLUSTER #####################################################
public void cluster() {
  //set cluster points: Still gotta make sure Pure White and Pure Black exists
  //Make sure the values of the clusters are far away from each other
  float proximity;
  float mostprox = 0;
  int closest = 0;
  int clustertimes = 3;
  int prevcluster = 0;
  int difference = 15;
  boolean again = false;
  for (int i = 0; i < clusternum; i++) {
    position[0] = PApplet.parseInt(random(0, 100));
    position[1] = PApplet.parseInt(random(0, 100));
    position[2] = PApplet.parseInt(random(0, 100));
    position[3] = 1;
    clusterposition[i] = PApplet.parseFloat(position);
    again = false;
    for (int a = 0; a < prevcluster; a++) {
      if (abs(clusterposition[a][0] - position[0]) < difference && abs(clusterposition[a][1] - position[1]) < difference && abs(clusterposition[a][2] - position[2]) < difference) {
        again = true;
      }
    }
    if (again == true) {
      i--;
    } else {
      prevcluster++;
    }
  }
  for (int p = 0; p < inimg.width * inimg.height; p = p + 2) {
    mostprox = 0;
    closest = 0;
    for (int i = 0; i < clusternum; i++) {
      proximity = sq(red(inimg.pixels[p]) - clusterposition[i][0]) + sq(green(inimg.pixels[p]) - clusterposition[i][1]) + sq(blue(inimg.pixels[p]) - clusterposition[i][2]);
      if (mostprox == 0 || proximity < mostprox) {
        closest = i;
        mostprox = proximity;
      }
    }
    clusterposition[closest][3]++;
    clusterposition[closest][0] = ((clusterposition[closest][0] * (clusterposition[closest][3] - 1)) + red(inimg.pixels[p])) / clusterposition[closest][3];
    clusterposition[closest][1] = ((clusterposition[closest][1] * (clusterposition[closest][3] - 1)) + green(inimg.pixels[p])) / clusterposition[closest][3];
    clusterposition[closest][2] = ((clusterposition[closest][2] * (clusterposition[closest][3] - 1)) + blue(inimg.pixels[p])) / clusterposition[closest][3];
  }
}
  public void settings() {  size(1200, 1200); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "Sketch_Test" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
