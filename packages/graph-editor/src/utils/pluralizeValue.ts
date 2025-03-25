function pluralizeValue(value: number, singular: string, plural?: string) {
  return `${value} ${plural ?? (singular + (value !== 1 ? 's' : ''))}`;
}

export default pluralizeValue;
