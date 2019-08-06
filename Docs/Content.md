## Content

##### Permet d'afficher du contenu séparé par block, relié via des boutons ou des timer

#### Affiche du contenus

**URL** :  `/content`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
    "content": "[id de la ligne du sheets content]"
}
```

**Exemple de requéte**

    localhost:8080/api/content?content=N78_1
 
 ##En cas de succés :

```json 
 {
     "messages": [
         {
             "attachment": {
                 "type": "template",
                 "payload": {
                     "template_type": "button",
                     "text": "Le saviez-vous 🚩\n\nIl est important de donner un supplément de vitamine D aux jeunes enfants ?\n\nQuand ? Pourquoi ? Je te dis tout !",
                     "buttons": [
                         {
                             "type": "json_plugin_url",
                             "title": "Ça m'interesse",
                             "url": "http://52.14.42.174:8080/api/content?content=N78_2"
                         }
                     ]
                 }
             }
         }
     ],
     "set_attributes": {
         "next": 0
     }
 }
 ```
 
 ##En cas d'échec :

```json 
 {
     "status": 204,
     "log": "No data for day undefined"
 }
 ````