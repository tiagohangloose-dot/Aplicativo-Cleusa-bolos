/**
 * Helper to generate a standard static PIX copy-and-paste payload
 * for Dona Cleusa's PIX key.
 */
export const generatePixCopyPaste = (amount: number): string => {
  const key = "+5512988275469"; // Celular formatado no padrão internacional com +55 exigido pelo Banco Central
  const merchantName = "CLEUSA DALMAS COSTA";
  const merchantCity = "SAO JOSE DOS CAMPOS";
  
  const formatPart = (id: number, value: string) => {
    const idStr = id.toString().padStart(2, '0');
    const lenStr = value.length.toString().padStart(2, '0');
    return `${idStr}${lenStr}${value}`;
  };

  // ID 26: Merchant Account Info
  const gui = formatPart(0, 'br.gov.bcb.pix');
  const chave = formatPart(1, key);
  const merchantAccountInfo = formatPart(26, `${gui}${chave}`);

  // ID 52: Merchant Category Code
  const categoryCode = formatPart(52, '0000');
  // ID 53: Transaction Currency (986 is BRL)
  const currency = formatPart(53, '986');
  // ID 54: Transaction Amount
  const amountStr = amount.toFixed(2);
  const transactionAmount = formatPart(54, amountStr);
  // ID 58: Country Code (BR)
  const countryCode = formatPart(58, 'BR');
  // ID 59: Merchant Name
  const merchantNamePart = formatPart(59, merchantName);
  // ID 60: Merchant City
  const merchantCityPart = formatPart(60, merchantCity);
  // ID 62: Additional Data Field Template
  const txidPart = formatPart(5, '***');
  const additionalData = formatPart(62, txidPart);

  const payloadWithoutCRC = `000201${merchantAccountInfo}${categoryCode}${currency}${transactionAmount}${countryCode}${merchantNamePart}${merchantCityPart}${additionalData}6304`;

  // Calculate CRC16 CCITT
  let crc = 0xFFFF;
  for (let i = 0; i < payloadWithoutCRC.length; i++) {
    const byte = payloadWithoutCRC.charCodeAt(i);
    let temp = ((crc >> 8) ^ byte) & 0xFF;
    temp ^= temp >> 4;
    crc = ((crc << 8) ^ (temp << 12) ^ (temp << 5) ^ temp) & 0xFFFF;
  }
  const crcHex = crc.toString(16).toUpperCase().padStart(4, '0');

  return `${payloadWithoutCRC}${crcHex}`;
};
