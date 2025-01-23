CREATE OR REPLACE DATABASE dp3d;
USE dp3d;

CREATE OR REPLACE TABLE matieres (
    id_matiere INT AUTO_INCREMENT PRIMARY KEY,
    nom_matiere VARCHAR(255) NOT NULL,
    diametre_matiere VARCHAR(255),
    quantite_matiere VARCHAR(255),
    achat_ttc VARCHAR(255),
    achat_ht VARCHAR(255),
    vente_matiere VARCHAR(255),
    imprimante VARCHAR(255)
    );

CREATE OR REPLACE TABLE imprimantes (
    id_imprimante INT AUTO_INCREMENT PRIMARY KEY,
    nom_imprimante VARCHAR(255) NOT NULL,
    type_imprimante VARCHAR(255),
    energie_consommee VARCHAR(255),
    cout_energie_consommee VARCHAR(255),
    energie_nettoyage_consommee VARCHAR(255),
    cout_energie_nettoyage VARCHAR(255),
    quantite_liquide_consommee VARCHAR(255),
    cout_nettoyage_liquide VARCHAR(255),
    cout_nettoyage_humain VARCHAR(255),
    taille_max_x VARCHAR(255),
    taille_max_y VARCHAR(255),
    taille_max_z VARCHAR(255)
);

CREATE OR REPLACE TABLE identifiants (
    id_identifiant INT AUTO_INCREMENT PRIMARY KEY,
    identifiant VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);

