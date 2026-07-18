const tags = [
  "enfants",
  "mariés",
  "khodadeen",
  "lepagnot",
  "bernier",
  "Alice",
  "Ambre",
  "Elisabeth Canick",
  "Eric",
  "Elena",
  "Gabriel",
  "Henri",
  "Jade",
  "Jennifer",
  "Aféz",
  "Ajam",
  "Claudine",
  "Iqbal",
  "Noorani",
  "Shamine",
  "Sylvianne",
  "Betty",
  "Blandine",
  "Sarah",
  "Kévin",
  "Louis",
  "Philippe",
  "Christine",
  "Alisson",
  "Audrey",
  "Victor",
  "David",
  "Elisabeth Heddebaut",
  "Elise",
  "Félicien",
  "Stella",
  "Corinne",
  "Francoise",
  "Géraldine",
  "Jean Paul",
  "Martial",
  "Mickael",
  "Thevy",
  "Sovana",
  "Soraya",
  "César",
  "Cyril",
  "Fred",
  "Isabelle",
  "Joanna",
  "Morad",
  "Pamela",
  "Romain",
  "Sophie",
];

export default function Page() {
  return (
    <>
      <h1>Recherchez les images ou vidéos où sont présentent :</h1>
      <div>
        {tags.map((tag) => (
          <div className={`badge me-2`}>#{tag}</div>
        ))}
      </div>
    </>
  );
}
