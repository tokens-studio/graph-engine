export interface ISerializable<SerializedType>{
    serialize(): SerializedType;
}