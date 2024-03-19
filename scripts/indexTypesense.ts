import Typesense from 'typesense';
import 'dotenv/config';
import diffusionDB1 from './data/diffusiondb-part-000001-with-base64-images-1.json';
import diffusionDB2 from './data/diffusiondb-part-000001-with-base64-images-2.json';
import diffusionDB3 from './data/diffusiondb-part-000002-with-base64-images-1.json';
import diffusionDB4 from './data/diffusiondb-part-000002-with-base64-images-2.json';

(async () => {
  console.log('Connecting to typesense server...');

  const typesense = new Typesense.Client({
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY || 'xyz',
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http',
      },
    ],
    connectionTimeoutSeconds: 60 * 60,
  });

  try {
    await typesense.collections('DiffusionDB').retrieve();
    console.log('Found existing collection of DiffusionDB');

    if (process.env.FORCE_REINDEX !== 'true')
      return console.log('FORCE_REINDEX = false. Canceling operation...');

    console.log('Deleting collection');
    await typesense.collections('DiffusionDB').delete();
  } catch (err) {
    console.error(err);
  }

  console.log('Creating schema...');

  await typesense.collections().create({
    name: 'DiffusionDB',
    fields: [
      {
        name: 'image_name',
        type: 'string',
      },
      {
        name: 'prompt',
        type: 'string',
      },
      {
        name: 'seed',
        type: 'string',
      },
      {
        name: 'step',
        type: 'string',
      },
      {
        name: 'cfg',
        type: 'auto',
      },
      {
        name: 'sampler',
        type: 'string',
      },
      {
        name: 'image',
        type: 'image',
        store: false,
      },
      {
        name: 'embedding',
        type: 'float[]',
        embed: {
          from: ['image'],
          model_config: {
            model_name: 'ts/clip-vit-b-p32',
          },
        },
      },
    ],
  });

  console.log('Populating collection...');

  const indexData = async (data: any) => {
    try {
      const returnData = await typesense
        .collections('DiffusionDB')
        .documents()
        .import(data);

      console.log('Return data: ', returnData);
    } catch (err) {
      console.error(err);
    }
  };

  console.log('Indexing diffusionDB part 000001 - 1');

  await indexData(diffusionDB1);

  console.log('Indexing diffusionDB part 000001 - 2');

  await indexData(diffusionDB2);

  console.log('Indexing diffusionDB part 000002 - 1');

  await indexData(diffusionDB3);

  console.log('Indexing diffusionDB part 000002 - 2');

  await indexData(diffusionDB4);
})();
