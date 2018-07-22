
import sys

for file_name in sys.argv:
	print "Looking for errors on "+file_name+"..."
	
	file = open(file_name, 'r')
	read_data = file.read()
	file.close()

	anterior_virgula = 0 
	anterior_bara = 0
	posicao = 0
	espera_barra_n = 0
	line_count = 0

	for char in read_data:

		if(char == '\n'):
			line_count = line_count + 1

		if(espera_barra_n):
			if(char == '\n'):
				espera_barra_n = 0
			continue

		if(char == ','):

			anterior_virgula = 1
			anterior_barra = 0

		elif( char == ']' or char == '}' or char == ')' ):

			anterior_barra = 0
			if(anterior_virgula):
				print "Encontrado ocorrencia de virgula em "+file_name+" (linha: "+str(line_count)+")"
				print "#############################"
				print read_data[posicao-50:posicao+50]
				print "#############################"

		elif( char == ' ' or char == '\n' or char == '\t' or char == '\r'):

			anterior_barra = 0
			anterior_virgula = anterior_virgula

		elif( char == '/' ):

			if(anterior_barra):
				anterior_barra = 0
				espera_barra_n = 1
			else:
				anterior_barra = 1
				
		else:
			anterior_barra = 0
			anterior_virgula = 0	
		
		posicao = posicao+1
