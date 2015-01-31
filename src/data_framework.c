#include <pebble.h>
#include "data_framework.h"

QDataPackage *qdatapackage_create(){
	QDataPackage *package;
	package = malloc(sizeof(QDataPackage));

	return package;
}

void qdatapackage_send(QDataPackage *package){
	QDataPackage toSend;
	memcpy(&toSend, package, sizeof(toSend));

	
}