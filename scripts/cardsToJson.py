import csv
import sys
import os
import string
import random
import json

fin = open("Slay the Spire Reference - Cards.csv", 'r+')
fout = open("cardOutput.json", 'w+')

try:
	data = {}
	currentColor = "Red"
	lineone = True;
	spamreader = csv.reader(fin, delimiter=',', quotechar='"')
	for line in spamreader:
		if lineone == True:
			lineone = False;
		elif line[1] == "":
			currentColor = line[0]
		else:
			cardId = line[0]
			if cardId == "Strike" or cardId == "Defend" :
				cardId = cardId + "-" + currentColor
			data[cardId] = {
				"Name": line[0],
				"Color": currentColor,
				"Type": line[1],
				"Rarity": line[2],
				"Cost": line[3],
				"Description": line[4],
				"Description (Upgraded)": line[5]
			}
	fout.write(json.dumps(data, sort_keys=True, indent=2))

finally:
	fin.close()
	fout.close()
