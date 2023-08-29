export default function ProfilBio({ profil }) {
  return (
    <>
      <span className="items-center flex w-max gap-5">
        <h1 className="text-2xl font-bold">{profil.full_name}</h1>
        <h1 className="text-sm">{profil.email}</h1>
      </span>
    </>
  );
}
