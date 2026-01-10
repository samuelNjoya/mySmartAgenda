# Défi technique – Poste de développeur web Full Stack

## Énoncé

L’objectif est de créer un **système simple de gestion des employés** permettant à un responsable RH de gérer les employés d’une entreprise.
L’application doit être simple à **créer** de votre côté et simple à **utiliser** du point de vue de l’utilisateur final.

Elle se compose de **4 vues**, avec **13 exigences** et **12 fonctionnalités bonus**.

---

### 1 – Vue Employé unique (/employees/:id & /employees/new)

**Formulaire de création / mise à jour**

Une page affichant un formulaire permettant de créer et de mettre à jour un employé. Elle permet à l’utilisateur de :

* Créer un nouvel employé
* Mettre à jour les informations d’un employé

**Spécifications**

* **Exigences :**

  1. Champs personnels à inclure (ex. : nom, email, numéro de téléphone, date de naissance…)
  2. Champs professionnels (ex. : poste, département, salaire, date de début, date de fin…)
  3. Validation des champs (ex. : champs requis, emails/numéros de téléphone valides…)
     Il n’est pas nécessaire de valider l’unicité ou des règles trop complexes
  4. Boutons de navigation vers la liste des employés

* **Bonus :**

  1. Photo de l’employé (à stocker dans le système de fichiers de l’application)
  2. Documents tels que CV, pièce d’identité, etc. (à stocker dans le système de fichiers)
  3. Validation de conformité
     (ex. : vérifier que l’employé a plus de 18 ans, que le salaire est supérieur au salaire minimum ou qu’une pièce d’identité est téléchargée)
  4. Tout autre champ que vous jugez pertinent

Maximum **10 champs**, un design simple utilisant **grid** ou **flexbox** est suffisant.

---

### 2 – Vue Liste des employés (/employees)

**Vue Liste**

Une page affichant la liste des employés. Elle permet à l’utilisateur de :

* Voir la liste des employés
* Accéder à la vue d’un employé spécifique

**Spécifications**

* **Exigences :**

  5. Un lien pour chaque ligne menant à la vue de l’employé correspondant
  6. Pas plus de **5 colonnes pertinentes**
  7. Boutons de navigation vers la page de création d’un employé et vers la liste des feuilles de temps

* **Bonus :**

  5. Barre de recherche
  6. Tri par différents champs
  7. Filtrage
  8. Pagination

---

### 3 – Vue Feuille de temps unique (/timesheets/:id & /timesheets/new)

**Formulaire de création / mise à jour**

Une page affichant un formulaire permettant de créer et de mettre à jour une feuille de temps. Elle permet à l’utilisateur de :

* Créer une nouvelle feuille de temps
* Mettre à jour les informations d’une feuille de temps

**Spécifications**

* **Exigences :**

  8. Champs heure de début et heure de fin
  9. Champ employé (liste déroulante avec la liste des employés)
  10. Boutons de navigation vers l’employé, la liste des employés ou la liste des feuilles de temps

* **Bonus :**

  9. Validation : l’heure de début doit être antérieure à l’heure de fin
  10. Résumé : champ texte décrivant le travail effectué pendant la période de la feuille de temps

---

### 4 – Vue Liste des feuilles de temps (/timesheets)

**Vue Liste**

Une page affichant les feuilles de temps créées.

**Spécifications**

* **Exigences :**

  11. Vue calendrier utilisant le composant [`schedule-x.dev`](https://schedule-x.dev), voir cet [`exemple`](https://schedule-x.dev/docs/frameworks/react#example) pour l’implémentation
  12. Vue tableau similaire à celle des employés avec des liens vers la vue d’une feuille de temps
  13. Bouton permettant de basculer entre la vue calendrier et la vue tableau

* **Bonus :**

  11. Barre de recherche
  12. Filtrage par employé

---

## Stack technique

La stack est déjà implémentée :

* **Frontend** : React.js avec React Router
* **Backend** : fonctions `loader` et `action` de React Router (voir le scaffold fourni et la [documentation](https://reactrouter.com/))
* **Base de données** : SQLite

---

## Étapes

1. Faire un [`git pull`](https://github.com/git-guides/git-pull) de ce dépôt ou le **forker**, puis récupérer votre fork.

2. Installer **Node.js et npm** sur votre machine si ce n’est pas déjà fait.

3. Ajouter de nouveaux champs aux tables `employees` et `timesheets` en modifiant `./app/db/schema.sql`.

4. Créer la base de données en exécutant :

   ```bash
   npm run setup_db
   ```

5. Ajouter de nouvelles données de seed en modifiant `./scripts/seed.js`.

6. Insérer les données de seed avec :

   ```bash
   npm run seed
   ```

7. Lancer le serveur de développement avec :

   ```bash
   npm run dev
   ```

8. Modifier ces **6 fichiers** afin de satisfaire autant que possible les **13 exigences** et les **12 bonus**.
   Une base est fournie, les vues employé unique et feuille de temps unique ne sont pas implémentées.
   Il est conseillé d’extraire les formulaires des pages de création en composants réutilisables.

   * `app/routes/employees._index/route.tsx`
   * `app/routes/employees.$employeeId._index/route.tsx`
   * `app/routes/employees.new/route.tsx`
   * `app/routes/timesheets._index/route.tsx`
   * `app/routes/timesheets.$timesheetId._index/route.tsx`
   * `app/routes/timesheets.new/route.tsx`

9. Vérifier que l’application fonctionne avec :

   ```bash
   npm run setup_db
   npm run seed
   npm run build
   npm run start
   ```

10. Pousser votre code dans un dépôt **public**.

---

## Ce qui n’est pas requis

* Le style (l’application doit simplement être utilisable) ; si vous souhaitez styliser, décommentez le code Tailwind dans `app.css` ou écrivez vos propres styles sans Tailwind ni autre librairie.
* Authentification, autorisation.
* Tests (facultatifs mais appréciés).
* Déploiement (optionnel).
* Typage strict (l’application utilise TypeScript, mais vous pouvez utiliser `any` ou ignorer les erreurs).
* Gestion des erreurs (optionnelle mais appréciée).
