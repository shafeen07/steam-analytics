with source as (
    select * from {{ source('raw', 'game_details') }}
),

steamspy as (
    select distinct on (app_id)
        app_id,
        owners,
        positive_reviews,
        negative_reviews,
        avg_playtime_hrs,
        median_playtime_hrs,
        ccu
    from {{ source('raw', 'steamspy_snapshots') }}
    order by app_id, snapped_at desc
),

renamed as (
    select
        s.app_id,
        s.name,
        s.developer,
        s.publisher,
        s.is_free,
        s.price_usd,
        s.release_date,
        s.coming_soon,
        s.header_image,
        s.short_description,
        s.metacritic_score,
        s.recommendations,
        s.fetched_at,
        sp.owners,
        sp.positive_reviews,
        sp.negative_reviews,
        sp.avg_playtime_hrs,
        sp.median_playtime_hrs,
        sp.ccu
    from source s
    left join steamspy sp on s.app_id = sp.app_id
)

select * from renamed