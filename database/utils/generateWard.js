const wards = [
  "Phường 1",
  "Phường 2",
  "Phường 3",
  "Phường 4",
  "Phường 6",
  "Phường 8",
  "Phường 9",
  "Phường 10",
  "Phường 13",
  "Phường 14",
  "Phường 15",
  "Phường 16",
  "Phường 18",
];

export default async function generateWard() {
  wards.map((ward) => {
    const entity = {
      ward,
      district: {
        $oid: "659f529657d75841a352f68a",
      },
      status: true,
    };
    console.log(entity);
    return entity;
  });
}
