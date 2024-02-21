export async function POST(req: Request) {
    try {
        const banner = await req.formData()

        const [large_image, small_image, link] = [banner.get('large_image') as File, banner.get('small_image') as File, banner.get('link') as string]

        if (!large_image || !small_image || !link) return NextResponse.json({ error: 'Insira todos os dados do formulário: large_image, small_image e link' });

        const [bufferLarge, bufferSmall] = [await large_image.arrayBuffer(), await small_image.arrayBuffer()]

        // Comprimindo buffers para salvar na base
        const compressedBufferLarge = await promisify(zlib.gzip)(Buffer.from(bufferLarge));
        const compressedBufferSmall = await promisify(zlib.gzip)(Buffer.from(bufferSmall));


        console.log((bufferLarge.byteLength - compressedBufferLarge.byteLength) + (bufferSmall.byteLength - compressedBufferSmall.byteLength) + " foi a quantidade de bytes que vc economizou após comprimir o arquivo")

        // Descomprimindo buffer para resgatar sua url
        const descompressedBuffer = await promisify(zlib.gunzip)(compressedBufferLarge)
        const descompressedBase64 = Buffer.from(descompressedBuffer).toString('base64')
        const imageSrc = `data:image/png;base64,${descompressedBase64}`
        
        return NextResponse.json({ newBanner: "e" });

    } catch (error) {
        return NextResponse.json({ error: 'Dados incompletos' })
    }
}