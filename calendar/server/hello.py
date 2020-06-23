#!/usr/bin/python

import sys
import os
#sys.path.insert(1, '/Users/antimary/Sites/alaminute/ingredient-phrase-tagger')
#import parse-ingredients
#import convert-to-json

ingredients = "Chicken :\
4oz boneless chicken thigh, with or without skin, cut into 3-4 pieces\
1 t soy sauce (if you are not making the green onion sauce, increase to 2t)\
1 T sake\
1 t peeled and grated fresh ginger\
Vegetable oil, for deep-frying\
4 T cornstarch\
Handful arugula or other green salad leaves\
\
Green onion sauce :\
1 T rice vinegar\
1 T soy sauce\
1 T finely chopped green onion\
Pinch sugar\
Few drops sesame oil\
1 t peeled and grated fresh ginger"

#os.system("generate_data --data-path=input.csv --count=1000 --offset=0 > tmp/train_file")


print "Content-type:text/html\r\n\r\n"
print '<html>'
print '<head>'
print '<title>Hello World - First CGI Program</title>'
print '</head>'
print '<body>'
print '<h2>Hello World! This is my first CGI program</h2>'
os.system("python /Users/antimary/Sites/alaminute/ingredient-phrase-tagger/bin/parse-ingredients.py /Users/antimary/Sites/alaminute/ingredient-phrase-tagger/bin/input.txt")
print '</body>'
print '</html>'